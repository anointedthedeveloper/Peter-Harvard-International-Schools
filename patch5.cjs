const fs = require('fs');

// 1. App.jsx — ticker fallback
let app = fs.readFileSync('src/App.jsx', 'utf8');
app = app.replace(
  "'Excellence in Education', 'Admissions Open', 'World-Class Facilities',\n    'Expert Faculty', 'Global Curriculum', \"Peter Harvard Int'l Schools\",",
  "'Responsibility & Excellence', 'Admissions Open', 'World-Class Facilities',\n    'Expert Faculty', 'Global Curriculum', \"Peter Harvard Int'l Schools\","
);
fs.writeFileSync('src/App.jsx', app, 'utf8');
process.stdout.write('App.jsx: ' + (app.includes('Responsibility & Excellence') ? 'done' : 'FAILED') + '\n');

// 2. Home.jsx — Global Perspective (title is split: title:'Global', subtitle:'Perspective')
let home = fs.readFileSync('src/pages/Home.jsx', 'utf8');
// Find the exact feature object with title:'Global'
home = home.replace(
  "{ icon: Globe, title: 'Global Mindset'",
  "{ icon: Globe, title: 'Global Mindsets'"
);
// Also check if it's split title/subtitle pattern
home = home.replace("title: 'Global',", "title: 'Globals',");
home = home.replace("subtitle: 'Perspective'", "subtitle: 'Perspectives'");
// Also handle combined
home = home.replace("'Global Perspective'", "'Global Perspectives'");
fs.writeFileSync('src/pages/Home.jsx', home, 'utf8');
process.stdout.write('Home.jsx done\n');
