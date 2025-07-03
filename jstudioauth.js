// Existing login, logout, and profile code remains the same...

function toggleSidebar() {
  document.getElementById("profileSidebar").classList.toggle("show");
}

function setupProfile() {
  const user = localStorage.getItem("jstudioUser");
  if (!user) return;

  document.getElementById("usernameDisplay").textContent = user;
  const avatar = document.getElementById("avatar");
  const firstLetter = user.charAt(0).toUpperCase();
  avatar.textContent = firstLetter;

  const colors = ["#FF6B6B", "#6BCB77", "#4D96FF", "#F9C74F", "#9D4EDD"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  avatar.style.backgroundColor = color;

  loadThemeSettings(); // Apply saved theme if exists
}

function applyTheme(hue, sat, mode) {
  const lightness = mode === 'dark' ? '20%' : '90%';
  const textColor = mode === 'dark' ? '#ffffff' : '#000000';

  document.documentElement.style.setProperty('--theme-hue', hue);
  document.documentElement.style.setProperty('--theme-sat', `${sat}%`);
  document.documentElement.style.setProperty('--theme-lightness', lightness);
  document.documentElement.style.setProperty('--text-color', textColor);

  // Save preferences
  localStorage.setItem('themeHue', hue);
  localStorage.setItem('themeSat', sat);
  localStorage.setItem('themeMode', mode);
}

function loadThemeSettings() {
  const hue = localStorage.getItem('themeHue') || 240;
  const sat = localStorage.getItem('themeSat') || 60;
  const mode = localStorage.getItem('themeMode') || 'dark';
  applyTheme(hue, sat, mode);

  document.getElementById("hue").value = hue;
  document.getElementById("saturation").value = sat;
  document.getElementById("mode").value = mode;
}

if (window.location.pathname.includes("jstudiohome.html")) {
  setupProfile();

  document.getElementById("hue").addEventListener("change", (e) => {
    const hue = e.target.value;
    const sat = document.getElementById("saturation").value;
    const mode = document.getElementById("mode").value;
    applyTheme(hue, sat, mode);
  });

  document.getElementById("saturation").addEventListener("change", (e) => {
    const sat = e.target.value;
    const hue = document.getElementById("hue").value;
    const mode = document.getElementById("mode").value;
    applyTheme(hue, sat, mode);
  });

  document.getElementById("mode").addEventListener("change", (e) => {
    const mode = e.target.value;
    const hue = document.getElementById("hue").value;
    const sat = document.getElementById("saturation").value;
    applyTheme(hue, sat, mode);
  });
}
