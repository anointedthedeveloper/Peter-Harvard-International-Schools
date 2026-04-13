$f = 'c:\Users\Admin\Documents\PeterHarvard\Peter-Harvard-International-Schools\src\pages\Gallery.jsx'
$lines = Get-Content $f
$lines[41] = '    <div className="overflow-x-hidden bg-white dark:bg-gray-950">'
Set-Content $f $lines -Encoding UTF8
Write-Host "Fixed"
