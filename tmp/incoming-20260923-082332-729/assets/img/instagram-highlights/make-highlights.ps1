Add-Type -AssemblyName System.Drawing

$outputDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$items = @(
    @{ File = 'recording-emoji'; Text = [char]::ConvertFromUtf32(0x1F399) },
    @{ File = 'reviews-emoji'; Text = [char]::ConvertFromUtf32(0x2B50) },
    @{ File = 'faq-emoji'; Text = [char]::ConvertFromUtf32(0x2753) }
)

foreach ($item in $items) {
    $size = 2160
    $bitmap = [System.Drawing.Bitmap]::new($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $graphics.Clear([System.Drawing.Color]::White)

    $outer = [System.Drawing.Rectangle]::new(200, 200, 1760, 1760)
    $rim = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        $outer,
        [System.Drawing.Color]::FromArgb(246, 247, 248),
        [System.Drawing.Color]::FromArgb(134, 142, 150),
        45.0
    )
    $graphics.FillEllipse($rim, $outer)

    $middle = [System.Drawing.Rectangle]::new(226, 226, 1708, 1708)
    $graphics.FillEllipse([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(251, 251, 250)), $middle)

    $innerRim = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(210, 214, 218), 3)
    $graphics.DrawEllipse($innerRim, 255, 255, 1650, 1650)

    $disc = [System.Drawing.Rectangle]::new(273, 273, 1614, 1614)
    $discBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        $disc,
        [System.Drawing.Color]::FromArgb(255, 255, 255),
        [System.Drawing.Color]::FromArgb(242, 243, 244),
        135.0
    )
    $graphics.FillEllipse($discBrush, $disc)

    $font = [System.Drawing.Font]::new('Segoe UI Emoji', 660, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $format = [System.Drawing.StringFormat]::new()
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $ink = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(70, 74, 78))
    $graphics.DrawString($item.Text, $font, $ink, [System.Drawing.RectangleF]::new(330, 630, 1500, 900), $format)

    $target = Join-Path $outputDir ($item.File + '.png')
    $resized = [System.Drawing.Bitmap]::new(1080, 1080)
    $smallGraphics = [System.Drawing.Graphics]::FromImage($resized)
    $smallGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $smallGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $smallGraphics.DrawImage($bitmap, 0, 0, 1080, 1080)
    $resized.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)

    $smallGraphics.Dispose()
    $resized.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
    $rim.Dispose()
    $innerRim.Dispose()
    $discBrush.Dispose()
    $font.Dispose()
    $format.Dispose()
    $ink.Dispose()
}
