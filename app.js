/* -------------------------------------------------------------
   Build with Gemma - GDG TIU Buildathon RSVP Portal Logic
   Features: Particle background, Countdown, Form validation,
             LocalStorage sync, Badge/QR generation, Dashboard
------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. STAR PARTICLES BACKGROUND
    // ---------------------------------------------------------
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    const colors = [
        'rgba(66, 133, 244, 0.4)',  // Blue
        'rgba(155, 93, 229, 0.4)', // Purple
        'rgba(241, 91, 181, 0.4)', // Pink
        'rgba(0, 245, 212, 0.4)'    // Cyan
    ];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 2 + 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.opacitySpeed = (Math.random() - 0.5) * 0.01;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.radius * 3;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow for performance
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce back from boundaries
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Opacity breathing effect
            this.opacity += this.opacitySpeed;
            if (this.opacity < 0.1 || this.opacity > 0.7) {
                this.opacitySpeed *= -1;
            }
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles() {
        const maxDistance = 120;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const alpha = (1 - (distance / maxDistance)) * 0.15;
                    ctx.strokeStyle = `rgba(155, 93, 229, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // Re-init particles on resize to fit density
    window.addEventListener('resize', initParticles);

    // ---------------------------------------------------------
    // 2. LIVE COUNTDOWN TIMER
    // ---------------------------------------------------------
    // Event: July 31, 2026, 2:00 PM IST
    const eventStartDate = new Date("2026-07-31T14:00:00+05:30").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = eventStartDate - now;

        const dSpan = document.getElementById('days');
        const hSpan = document.getElementById('hours');
        const mSpan = document.getElementById('minutes');
        const sSpan = document.getElementById('seconds');

        if (timeLeft <= 0) {
            // Event has started
            dSpan.innerText = "00";
            hSpan.innerText = "00";
            mSpan.innerText = "00";
            sSpan.innerText = "00";
            document.querySelector('.countdown-heading').innerHTML = '<i class="fa-solid fa-circle-play text-cyan"></i> HACKATHON IS NOW LIVE!';
            return;
        }

        // Calculations
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Render with leading zero
        dSpan.innerText = String(days).padStart(2, '0');
        hSpan.innerText = String(hours).padStart(2, '0');
        mSpan.innerText = String(minutes).padStart(2, '0');
        sSpan.innerText = String(seconds).padStart(2, '0');
    }

    // Refresh countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ---------------------------------------------------------
    // 3. COLLAPSIBLE CUSTOM COLLEGE OPTION
    // ---------------------------------------------------------
    const collegeSelect = document.getElementById('college');
    const customCollegeGroup = document.getElementById('customCollegeGroup');
    const customCollegeInput = document.getElementById('customCollege');

    collegeSelect.addEventListener('change', () => {
        if (collegeSelect.value === 'Other') {
            customCollegeGroup.classList.remove('d-none');
            customCollegeInput.setAttribute('required', 'true');
            customCollegeInput.focus();
        } else {
            customCollegeGroup.classList.add('d-none');
            customCollegeInput.removeAttribute('required');
            customCollegeInput.value = '';
        }
    });

    // ---------------------------------------------------------
    // 4. RSVP REGISTRATION LOGIC & LOCALSTORAGE
    // ---------------------------------------------------------
    const rsvpForm = document.getElementById('rsvpForm');
    const ticketModal = document.getElementById('ticketModal');
    
    // Get all registered RSVPs from localStorage
    function getStoredRSVPs() {
        const stored = localStorage.getItem('gemma_rsvps');
        return stored ? JSON.parse(stored) : [];
    }

    // Save RSVPs to localStorage
    function saveRSVP(rsvp) {
        const rsvps = getStoredRSVPs();
        rsvps.push(rsvp);
        localStorage.setItem('gemma_rsvps', JSON.stringify(rsvps));
    }

    // Check if email already registered
    function isAlreadyRegistered(email) {
        const rsvps = getStoredRSVPs();
        return rsvps.some(r => r.email.toLowerCase() === email.toLowerCase());
    }

    // Helper to generate a unique RSVP ID (GEMMA-TIU-XXXXX)
    function generateRsvpId() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let uniquePart = '';
        for (let i = 0; i < 5; i++) {
            uniquePart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `GEMMA-TIU-${uniquePart}`;
    }

    // Handle Form Submit
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        let college = collegeSelect.value;
        if (college === 'Other') {
            college = customCollegeInput.value.trim();
        }
        const teamName = document.getElementById('teamName').value.trim() || 'Solo';
        const aiExperience = document.getElementById('aiExperience').value;
        const githubUrl = document.getElementById('githubUrl').value.trim();
        const prototypeDesc = document.getElementById('prototypeDesc').value.trim();
        
        // Validation Checks
        if (isAlreadyRegistered(email)) {
            alert('This email is already registered for the Build with Gemma Buildathon! Click on the Dashboard icon in the top right to view or re-download your badge.');
            return;
        }

        // Create RSVP object
        const rsvpId = generateRsvpId();
        const newRsvp = {
            id: rsvpId,
            fullName,
            email,
            phone,
            college,
            teamName,
            aiExperience,
            githubUrl,
            prototypeDesc,
            timestamp: new Date().toISOString()
        };

        // Save
        saveRSVP(newRsvp);

        // Display Ticket Modal
        showTicket(newRsvp);

        // Reset form
        rsvpForm.reset();
        customCollegeGroup.classList.add('d-none');
        customCollegeInput.removeAttribute('required');

        // Sync Dashboard
        updateDashboard();
    });

    // ---------------------------------------------------------
    // 5. BADGE GENERATION & QR CODE CREATION
    // ---------------------------------------------------------
    let currentTicketData = null; // Store data of the currently shown ticket for download/print reference

    function showTicket(rsvp) {
        currentTicketData = rsvp;

        // Map Experience to Role
        let role = "DEVELOPER";
        if (rsvp.aiExperience === 'Beginner') {
            role = "CREATOR";
        } else if (rsvp.aiExperience === 'Advanced') {
            role = "AI ARCHITECT";
        }

        // Populate HTML fields
        document.getElementById('ticketName').innerText = rsvp.fullName;
        document.getElementById('ticketId').innerText = rsvp.id;
        document.getElementById('ticketTeam').innerText = rsvp.teamName;
        document.getElementById('ticketCollege').innerText = rsvp.college;
        document.getElementById('ticketExp').innerText = rsvp.aiExperience;
        document.getElementById('ticketRole').innerText = role;

        // Set colors or classes based on role
        const ticketRoleLabel = document.getElementById('ticketRole');
        ticketRoleLabel.className = 't-badge-type'; // reset
        if (role === 'AI ARCHITECT') {
            ticketRoleLabel.style.borderColor = 'var(--gemini-pink)';
            ticketRoleLabel.style.color = 'var(--gemini-pink)';
            ticketRoleLabel.style.background = 'rgba(241, 91, 181, 0.15)';
        } else if (role === 'CREATOR') {
            ticketRoleLabel.style.borderColor = 'var(--google-green)';
            ticketRoleLabel.style.color = '#81c784';
            ticketRoleLabel.style.background = 'rgba(52, 168, 83, 0.15)';
        } else {
            ticketRoleLabel.style.borderColor = 'var(--google-blue)';
            ticketRoleLabel.style.color = '#8ab4f8';
            ticketRoleLabel.style.background = 'rgba(66, 133, 244, 0.15)';
        }

        // Generate QR Code via QRious
        try {
            // QR content is the unique ticket RSVP details
            const qrContent = `ID: ${rsvp.id}\nName: ${rsvp.fullName}\nEmail: ${rsvp.email}\nCollege: ${rsvp.college}`;
            
            // Clear old canvas contents if any (QRious will draw on it)
            const qrCanvas = document.getElementById('qrCanvas');
            
            new QRious({
                element: qrCanvas,
                value: qrContent,
                size: 200,
                background: '#ffffff',
                foreground: '#0b0f19', // Matches ticket deep theme
                level: 'H'
            });
        } catch (err) {
            console.error("QR Code generation failed", err);
        }

        // Open Modal
        ticketModal.classList.add('active');
    }

    // Modal Close
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalOverlay = document.querySelector('.modal-overlay');

    function closeModal() {
        ticketModal.classList.remove('active');
        currentTicketData = null;
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // ---------------------------------------------------------
    // 6. TICKET ACTIONS: DOWNLOAD & PRINT
    // ---------------------------------------------------------
    const downloadTicketBtn = document.getElementById('downloadTicketBtn');
    const printTicketBtn = document.getElementById('printTicketBtn');

    // Download Badge as PNG using html2canvas
    downloadTicketBtn.addEventListener('click', () => {
        if (!currentTicketData) return;

        const downloadBtnOriginalText = downloadTicketBtn.innerHTML;
        downloadTicketBtn.disabled = true;
        downloadTicketBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Generating PNG...';

        const renderArea = document.getElementById('renderArea');

        // Execute html2canvas rendering
        html2canvas(renderArea, {
            scale: 2, // High DPI rendering
            backgroundColor: null, // Transparent bg container
            useCORS: true,
            logging: false
        }).then(canvas => {
            // Generate download link
            const link = document.createElement('a');
            link.download = `Gemma-Buildathon-${currentTicketData.id}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            // Restore button
            downloadTicketBtn.disabled = false;
            downloadTicketBtn.innerHTML = downloadBtnOriginalText;
        }).catch(err => {
            console.error("Error creating pass download:", err);
            alert("Oops! We couldn't export your badge. Please try again or take a screenshot of your pass.");
            downloadTicketBtn.disabled = false;
            downloadTicketBtn.innerHTML = downloadBtnOriginalText;
        });
    });

    // Print Pass by opening a simplified printing frame
    printTicketBtn.addEventListener('click', () => {
        if (!currentTicketData) return;

        const printWindow = window.open('', '_blank');
        
        // Write HTML and essential stylesheets for printing
        printWindow.document.write(`
            <html>
            <head>
                <title>Print RSVP Badge - ${currentTicketData.id}</title>
                <link rel="stylesheet" href="style.css">
                <style>
                    body {
                        background: #ffffff !important;
                        color: #000000 !important;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        padding: 0;
                        margin: 0;
                    }
                    /* Custom print adjustments for high-fidelity ticket styling */
                    .ticket-badge {
                        box-shadow: none !important;
                        border: 2px solid #000000 !important;
                        background: linear-gradient(135deg, #0e1222 0%, #171026 50%, #0d1a29 100%) !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        color: #ffffff !important;
                        margin: 0;
                    }
                    .t-notch {
                        background: #ffffff !important;
                        border-color: #000000 !important;
                    }
                </style>
            </head>
            <body>
                <div style="padding: 20px;">
                    ${document.getElementById('renderArea').innerHTML}
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        
        // Allow images & stylesheets to load before printing
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 600);
    });

    // ---------------------------------------------------------
    // 7. ADMIN / RSVP DASHBOARD DRAWER
    // ---------------------------------------------------------
    const dashboardDrawer = document.getElementById('dashboardDrawer');
    const dashboardToggle = document.getElementById('navDashboardBtn');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const drawerOverlay = document.getElementById('drawerOverlay');

    const searchInput = document.getElementById('searchRsvp');
    const rsvpList = document.getElementById('rsvpList');

    function openDrawer() {
        updateDashboard();
        dashboardDrawer.classList.add('active');
    }

    function closeDrawer() {
        dashboardDrawer.classList.remove('active');
    }

    dashboardToggle.addEventListener('click', openDrawer);
    drawerCloseBtn.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);

    // Refresh metrics and render the registration items
    function updateDashboard() {
        const rsvps = getStoredRSVPs();

        // Update stats
        document.getElementById('statTotal').innerText = rsvps.length;
        
        const advancedCount = rsvps.filter(r => r.aiExperience === 'Advanced').length;
        document.getElementById('statAdvanced').innerText = advancedCount;

        renderRsvpList(rsvps);
    }

    // Render registered users
    function renderRsvpList(rsvpsToRender) {
        rsvpList.innerHTML = ''; // Clear

        if (rsvpsToRender.length === 0) {
            rsvpList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-regular fa-folder-open"></i>
                    <p>No RSVPs matching your search criteria.</p>
                </div>
            `;
            return;
        }

        // Sort: Latest first
        const sorted = [...rsvpsToRender].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        sorted.forEach(rsvp => {
            const item = document.createElement('div');
            item.className = 'rsvp-item';

            item.innerHTML = `
                <div class="item-info">
                    <h5>${escapeHTML(rsvp.fullName)}</h5>
                    <span class="item-id">${rsvp.id}</span>
                    <span class="item-meta">${escapeHTML(rsvp.college)} • ${escapeHTML(rsvp.teamName)}</span>
                </div>
                <div class="item-actions">
                    <button class="btn btn-primary btn-mini view-badge-btn" data-id="${rsvp.id}">
                        <i class="fa-solid fa-eye"></i> View
                    </button>
                    <button class="btn btn-secondary btn-mini delete-badge-btn text-pink" data-id="${rsvp.id}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;

            rsvpList.appendChild(item);
        });

        // Add action listeners to dynamically generated items
        document.querySelectorAll('.view-badge-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                const rsvp = getStoredRSVPs().find(r => r.id === id);
                if (rsvp) {
                    closeDrawer();
                    showTicket(rsvp);
                }
            });
        });

        document.querySelectorAll('.delete-badge-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                if (confirm(`Are you sure you want to cancel and delete the RSVP registration for ID ${id}?`)) {
                    let rsvps = getStoredRSVPs();
                    rsvps = rsvps.filter(r => r.id !== id);
                    localStorage.setItem('gemma_rsvps', JSON.stringify(rsvps));
                    updateDashboard();
                }
            });
        });
    }

    // Filter registrations via search input
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        const rsvps = getStoredRSVPs();

        if (!query) {
            renderRsvpList(rsvps);
            return;
        }

        const filtered = rsvps.filter(r => 
            r.fullName.toLowerCase().includes(query) ||
            r.email.toLowerCase().includes(query) ||
            r.id.toLowerCase().includes(query) ||
            r.college.toLowerCase().includes(query) ||
            r.teamName.toLowerCase().includes(query)
        );

        renderRsvpList(filtered);
    });

    // Helper to escape HTML and prevent XSS injections in rendering
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
