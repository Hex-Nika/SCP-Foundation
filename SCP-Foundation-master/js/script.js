// SCP Foundation Database - JavaScript Implementation
document.addEventListener('DOMContentLoaded', function() {
    console.log('SCP Database System Initializing...');

    // Terminal Effect
    setTimeout(() => {
        const terminals = document.querySelectorAll('.terminal');
        terminals.forEach((terminal, index) => {
            terminal.style.opacity = '0';
            terminal.style.transform = 'translateY(20px)';
            terminal.style.transition = 'all 0.5s ease';

            setTimeout(() => {
                terminal.style.opacity = '1';
                terminal.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 1000);

    // SCP Item Interactions
    const scpItems = document.querySelectorAll('.scp-item');
    scpItems.forEach(item => {
        item.addEventListener('click', function() {
            const scpNumber = this.querySelector('.scp-number').textContent;
            const scpTitle = this.querySelector('.scp-title').textContent;

            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);

            // Terminal effect
            addToTerminal(`ACCESSING ${scpNumber} - ${scpTitle}...`);
            addToTerminal('SECURITY CHECK IN PROGRESS...');

            // Simulate database access
            setTimeout(() => {
                addToTerminal('DATA LOADED SUCCESSFULLY.');
                addToTerminal('CONTAINMENT STATUS: SECURE');
            }, 1500);
        });
    });

    // Glitch effect for title
    const glitchTitle = document.querySelector('.site-title');
    setInterval(() => {
        if (Math.random() > 0.95) {
            glitchTitle.style.animation = 'glitch 0.5s';
            setTimeout(() => {
                glitchTitle.style.animation = '';
            }, 500);
        }
    }, 2000);

    // Simulate random alerts
    setInterval(() => {
        const alerts = [
            'ANOMALY DETECTED IN SECTOR 7',
            'CONTAINMENT BREACH PROTOCOL ACTIVATED',
            'SECURITY LEVEL INCREASED TO ALPHA-LEVEL',
            'UNAUTHORIZED ACCESS ATTEMPT DETECTED',
            'BACKUP SYSTEMS ONLINE'
        ];

        if (Math.random() > 0.98) {
            addToTerminal(alerts[Math.floor(Math.random() * alerts.length)]);
        }
    }, 10000);

    // Scan line effect
    const scanLine = document.createElement('div');
    scanLine.style.position = 'fixed';
    scanLine.style.top = '0';
    scanLine.style.left = '0';
    scanLine.style.width = '100%';
    scanLine.style.height = '2px';
    scanLine.style.background = 'rgba(255, 255, 255, 0.3)';
    scanLine.style.pointerEvents = 'none';
    scanLine.style.zIndex = '9999';
    scanLine.style.animation = 'scanLine 10s linear infinite';
    document.body.appendChild(scanLine);

    // Add scanLine animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes scanLine {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Pixel art cursor
    document.addEventListener('mousemove', function(e) {
        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        trail.style.left = e.clientX - 5 + 'px';
        trail.style.top = e.clientY - 5 + 'px';
        trail.style.width = '10px';
        trail.style.height = '10px';
        trail.style.background = '#00ff41';
        trail.style.pointerEvents = 'none';
        trail.style.animation = 'fadeOut 1s ease forwards';
        document.body.appendChild(trail);

        setTimeout(() => {
            trail.remove();
        }, 1000);
    });

    // Add fadeOut animation
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
        }
    `;
    document.head.appendChild(fadeOutStyle);

    // Security protocol simulation
    const securityCheck = () => {
        addToTerminal('PERFORMING SECURITY CHECK...');
        setTimeout(() => {
            addToTerminal('SECURITY LEVEL VERIFIED: APPROVED');
        }, 1000);
    };

    // Initial security check
    setTimeout(securityCheck, 2000);

    // Interactive navigation
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            addToTerminal(`NAVIGATING TO ${this.textContent.toUpperCase()}...`);

            if (this.getAttribute('href').endsWith('.html')) {
                addToTerminal('EXTERNAL LINK DETECTED. REDIRECTING...');
                setTimeout(() => {
                    window.open(this.getAttribute('href'), '_blank');
                }, 1000);
            }
        });
    });

    // Database grid animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(50px)';

                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    scpItems.forEach(item => {
        observer.observe(item);
    });
});

// Terminal utility functions
function addToTerminal(message) {
    const terminal = document.querySelector('.terminal');
    if (!terminal) return;

    const newLine = document.createElement('div');
    newLine.className = 'terminal-line';
    newLine.style.opacity = '0';
    newLine.style.transform = 'translateX(-20px)';

    const prompt = document.createElement('span');
    prompt.className = 'terminal-prompt';
    prompt.textContent = 'SCP-AI:~$';

    const command = document.createElement('span');
    command.className = 'terminal-command';
    command.textContent = message;

    newLine.appendChild(prompt);
    newLine.appendChild(command);
    terminal.appendChild(newLine);

    // Animate the new line
    setTimeout(() => {
        newLine.style.transition = 'all 0.3s ease';
        newLine.style.opacity = '1';
        newLine.style.transform = 'translateX(0)';
    }, 10);

    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;

    // Remove old lines if too many
    const lines = terminal.querySelectorAll('.terminal-line');
    if (lines.length > 10) {
        lines[0].remove();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Shift + R for random access
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        addToTerminal('RANDOM ACCESS PROTOCOL ACTIVATED...');
        const scpItems = document.querySelectorAll('.scp-item');
        const randomItem = scpItems[Math.floor(Math.random() * scpItems.length)];
        randomItem.click();
        randomItem.scrollIntoView({ behavior: 'smooth' });
    }

    // Ctrl/Cmd + Shift + S for status check
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        addToTerminal('INITIATING SYSTEM DIAGNOSTICS...');
        setTimeout(() => {
            addToTerminal('ALL SYSTEMS NOMINAL');
        }, 1000);
    }
});

// Simulate system monitoring
setInterval(() => {
    const metrics = [
        'CPU USAGE: 47%',
        'MEMORY USAGE: 62%',
        'ACTIVE CONTAINMENT CELLS: 147',
        'SECURITY PROTOCOLS: ACTIVE',
        'BACKUP GENERATORS: NOMINAL'
    ];

    if (Math.random() > 0.95) {
        addToTerminal(metrics[Math.floor(Math.random() * metrics.length)]);
    }
}, 8000);