Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime]
$null = [Windows.Storage.Streams.IRandomAccessStream, Windows.Storage.Streams, ContentType=WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType=WindowsRuntime]
$null = [Windows.Graphics.Imaging.SoftwareBitmap, Windows.Graphics.Imaging, ContentType=WindowsRuntime]
$null = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType=WindowsRuntime]
$null = [Windows.Media.Ocr.OcrResult, Windows.Foundation, ContentType=WindowsRuntime]
$taskAwaitMethod = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1
function Await-ImageOperation($Operation, $ResultType) {
  $taskAwait = $taskAwaitMethod.MakeGenericMethod($ResultType).Invoke($null, @($Operation))
  $taskAwait.Wait()
  return $taskAwait.Result
}
$taskEngine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if (-not $taskEngine) { throw 'No installed OCR language' }
$taskRoot = (Resolve-Path '.').Path
$taskCandidates = @(Get-ChildItem -LiteralPath 'assets/img/reviews' -Recurse -File | Where-Object Extension -Match '^\.(png|webp|jpg)$') + @(Get-ChildItem -LiteralPath 'assets/16j/duo','assets/detail-solo-16j' -Filter 'top*' -File)
$taskResults = foreach ($taskCandidate in $taskCandidates) {
  try {
    $taskFile = Await-ImageOperation ([Windows.Storage.StorageFile]::GetFileFromPathAsync($taskCandidate.FullName)) ([Windows.Storage.StorageFile])
    $taskStream = Await-ImageOperation ($taskFile.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
    $taskDecoder = Await-ImageOperation ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($taskStream)) ([Windows.Graphics.Imaging.BitmapDecoder])
    $taskBitmap = Await-ImageOperation ($taskDecoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
    $taskResult = Await-ImageOperation ($taskEngine.RecognizeAsync($taskBitmap)) ([Windows.Media.Ocr.OcrResult])
    [PSCustomObject]@{file=$taskCandidate.FullName.Substring($taskRoot.Length+1).Replace('\','/');text=$taskResult.Text;error=$null}
    $taskBitmap.Dispose(); $taskStream.Dispose()
  } catch { [PSCustomObject]@{file=$taskCandidate.FullName.Substring($taskRoot.Length+1).Replace('\','/');text='';error=$_.Exception.Message} }
}
$taskResults | ConvertTo-Json -Depth 4 | Out-File -LiteralPath 'output/780-payback-20261021/image-ocr.json' -Encoding utf8
$taskResults | Where-Object { $_.text -match '\d[\d, ]{2,}' -or $_.error } | ConvertTo-Json -Depth 4
