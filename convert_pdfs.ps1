# Convert first page of each PDF to PNG image using Windows built-in PDF APIs
param()

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Runtime.WindowsRuntime

$asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
}

function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}

[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.Streams.InMemoryRandomAccessStream, Windows.Storage.Streams, ContentType = WindowsRuntime] | Out-Null

$files = @(
    @{ Input = "$PSScriptRoot\assets\certificates\kmb.pdf"; Output = "$PSScriptRoot\assets\certificates\kmb-preview.png" },
    @{ Input = "$PSScriptRoot\assets\certificates\sertifikatPelatihan.pdf"; Output = "$PSScriptRoot\assets\certificates\sertifikatPelatihan-preview.png" },
    @{ Input = "$PSScriptRoot\assets\certificates\MSIBPTAmati.pdf"; Output = "$PSScriptRoot\assets\certificates\MSIBPTAmati-preview.png" },
    @{ Input = "$PSScriptRoot\CV WILDANU UBAIDILLAH.pdf"; Output = "$PSScriptRoot\assets\certificates\cv-preview.png" }
)

foreach ($item in $files) {
    if (Test-Path $item.Input) {
        Write-Host "Converting: $($item.Input)"
        $fileTask = [Windows.Storage.StorageFile]::GetFileFromPathAsync($item.Input)
        $storageFile = Await $fileTask ([Windows.Storage.StorageFile])

        $pdfDocTask = [Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($storageFile)
        $pdfDoc = Await $pdfDocTask ([Windows.Data.Pdf.PdfDocument])

        if ($pdfDoc.PageCount -gt 0) {
            $page = $pdfDoc.GetPage(0)
            $stream = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
            $renderTask = $page.RenderToStreamAsync($stream)
            $asTaskVoid = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
                $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction'
            }
            $netTaskVoid = $asTaskVoid.Invoke($null, @($renderTask))
            $netTaskVoid.Wait(-1) | Out-Null

            $netStream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream)
            $img = [System.Drawing.Image]::FromStream($netStream)
            $img.Save($item.Output, [System.Drawing.Imaging.ImageFormat]::Png)
            $img.Dispose()
            $netStream.Dispose()
            $stream.Dispose()
            $page.Dispose()
            Write-Host "Saved: $($item.Output)"
        }
    }
}
Write-Host "Done converting all PDFs!"
