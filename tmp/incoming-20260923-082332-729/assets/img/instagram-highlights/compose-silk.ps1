Add-Type -AssemblyName System.Drawing

$generated = 'C:\Users\User\.codex\generated_images\01a0c10b-c2b3-7872-8d34-00d575cd362a'
$output = Split-Path -Parent $MyInvocation.MyCommand.Path
$background = [System.Drawing.Bitmap]::new((Join-Path $generated 'exec-dc15a768-4e5d-4355-88e3-df04431a7291.png'))

$items = @(
    @{ Source = 'exec-5bbe6920-0683-44c8-b259-bb2aeb74c75d.png'; File = 'recording-highlight-final.png'; Crop = [System.Drawing.Rectangle]::new(290, 135, 680, 990); Dest = [System.Drawing.Rectangle]::new(459, 394, 336, 490) },
    @{ Source = 'exec-d446ef28-2c51-4524-9cd6-3f07dee98b42.png'; File = 'reviews-highlight-final.png'; Crop = [System.Drawing.Rectangle]::new(235, 270, 790, 710); Dest = [System.Drawing.Rectangle]::new(397, 447, 460, 413) },
    @{ Source = 'exec-01e639c9-0faa-4276-a0c9-838e15d3a69f.png'; File = 'faq-highlight-final.png'; Crop = [System.Drawing.Rectangle]::new(305, 140, 645, 940); Dest = [System.Drawing.Rectangle]::new(469, 405, 316, 461); WhiteKey = $true }
)

foreach ($item in $items) {
    $source = [System.Drawing.Bitmap]::new((Join-Path $generated $item.Source))
    if ($item.WhiteKey) {
        $keyed = [System.Drawing.Bitmap]::new($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        for ($y = $item.Crop.Y; $y -lt ($item.Crop.Y + $item.Crop.Height); $y++) {
            for ($x = $item.Crop.X; $x -lt ($item.Crop.X + $item.Crop.Width); $x++) {
                $pixel = $source.GetPixel($x, $y)
                if ($pixel.R -ge 248 -and $pixel.G -ge 248 -and $pixel.B -ge 248) {
                    $keyed.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
                } else {
                    $keyed.SetPixel($x, $y, $pixel)
                }
            }
        }
        $source.Dispose()
        $source = $keyed
    }

    $canvas = [System.Drawing.Bitmap]::new($background.Width, $background.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($background, 0, 0)
    $graphics.DrawImage($source, $item.Dest, $item.Crop, [System.Drawing.GraphicsUnit]::Pixel)
    $canvas.Save((Join-Path $output $item.File), [System.Drawing.Imaging.ImageFormat]::Png)

    $graphics.Dispose()
    $canvas.Dispose()
    $source.Dispose()
}

$background.Dispose()
