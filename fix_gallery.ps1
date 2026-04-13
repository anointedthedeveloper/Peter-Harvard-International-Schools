$path = 'c:\Users\Admin\Documents\PeterHarvard\Peter-Harvard-International-Schools\src\pages\Gallery.jsx'
$lines = Get-Content $path
$lines[45] = '        <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=70" alt="Gallery banner" className="absolute inset-0 w-full h-full object-cover" />'
$lines[46] = '        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/70" />'
$lines[47] = ''
$lines[48] = ''
Set-Content $path $lines -Encoding UTF8
Write-Host "Done"
