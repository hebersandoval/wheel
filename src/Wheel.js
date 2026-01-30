import React, { useRef, useEffect, useState, useCallback } from 'react';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']; // Stable color palette.

const Wheel = ({ names, onSpinEnd, spinning, setSpinning }) => {
    const canvasRef = useRef(null);
    const [rotation, setRotation] = useState(0);
    // Draw wheel on canvas. Memoized to keep stable reference for useEffect deps.
    const drawWheel = useCallback(
        (ctx, rot) => {
            const num = names.length;
            if (num === 0) return;
            const arc = (Math.PI * 2) / num;
            ctx.clearRect(0, 0, 600, 600);
            ctx.save();
            ctx.translate(300, 300);
            ctx.rotate((rot * Math.PI) / 180);
            names.forEach((name, i) => {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, 300, i * arc, (i + 1) * arc);
                ctx.fillStyle = COLORS[i % COLORS.length];
                ctx.fill();
                ctx.save();
                ctx.rotate(i * arc + arc / 2);
                ctx.translate(150, 0);
                ctx.rotate(Math.PI / 2);
                ctx.fillStyle = '#FFF';
                ctx.font = 'bold 18px Arial'; // Slightly larger font for bigger wheel.
                ctx.fillText(name.substring(0, 12), -ctx.measureText(name.substring(0, 12)).width / 2, 0); // Truncate long names.
                ctx.restore();
            });
            ctx.restore();

            // Draw static arrow at top (pointing down to winner).
            ctx.beginPath();
            ctx.moveTo(300, 20); // Top center.
            ctx.lineTo(280, 60);
            ctx.lineTo(320, 60);
            ctx.closePath();
            ctx.fillStyle = '#FF0000'; // Red arrow.
            ctx.fill();
        },
        [names],
    );

    // Spinning animation with easing.
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) drawWheel(ctx, rotation);
    }, [drawWheel, rotation]);

    const startSpin = () => {
        if (names.length === 0 || spinning) return;
        setSpinning(true);
        const fullRotations = Math.floor(Math.random() * 5) + 5; // 5-10 spins.
        const targetAngle = Math.random() * 360 + fullRotations * 360;
        let startTime = null;
        const duration = 6000; // 6 seconds.

        const animate = (time) => {
            if (!startTime) startTime = time;
            const progress = (time - startTime) / duration;
            if (progress >= 1) {
                // Normalize final rotation to [0,360)
                const finalRot = ((targetAngle % 360) + 360) % 360;
                // Show normalized final rotation on the canvas
                setRotation(finalRot);

                const sliceAngle = 360 / names.length;
                // Arrow points downwards on screen — that's 270° from positive X-axis
                const ARROW_ANGLE = 270;
                // Compute winner index using positive modulo arithmetic
                const relativeAngle = (((ARROW_ANGLE - finalRot) % 360) + 360) % 360;
                const winnerIndex = Math.floor(relativeAngle / sliceAngle) % names.length;

                onSpinEnd(names[winnerIndex]);
                confettiBurst(); // First burst.
                setTimeout(confettiBurst, 500); // Second burst after 0.5s.
                return;
            }
            const eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic.
            setRotation(targetAngle * eased);
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    };

    // Full-window confetti (create temporary canvas over body).
    const confettiBurst = () => {
        const confettiCanvas = document.createElement('canvas');
        confettiCanvas.style.position = 'fixed';
        confettiCanvas.style.top = '0';
        confettiCanvas.style.left = '0';
        confettiCanvas.style.pointerEvents = 'none';
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
        document.body.appendChild(confettiCanvas);
        const ctx = confettiCanvas.getContext('2d');
        if (!ctx) return;

        const confetti = [];
        for (let i = 0; i < 200; i++) {
            // More particles for full screen.
            confetti.push({
                x: Math.random() * window.innerWidth,
                y: (Math.random() * window.innerHeight) / 2, // Start from top half.
                size: Math.random() * 10 + 5,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20 - 10, // Upward bias.
                rotation: Math.random() * Math.PI * 2,
                vrot: (Math.random() - 0.5) * 0.1,
                life: 200 + Math.random() * 100, // Frames to live.
            });
        }

        const gravity = 0.2;
        let frame = 0;
        const animateConfetti = () => {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            confetti.forEach((c) => {
                if (c.life > 0) {
                    c.vy += gravity;
                    c.x += c.vx;
                    c.y += c.vy;
                    c.rotation += c.vrot;
                    c.life--;
                    ctx.save();
                    ctx.translate(c.x, c.y);
                    ctx.rotate(c.rotation);
                    ctx.fillStyle = c.color;
                    ctx.globalAlpha = c.life / 300; // Fade out.
                    ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
                    ctx.restore();
                }
            });
            frame++;
            if (frame < 300)
                requestAnimationFrame(animateConfetti); // Run for ~5s.
            else document.body.removeChild(confettiCanvas); // Clean up.
        };
        animateConfetti();
    };

    return (
        <div className="card wheel">
            <canvas ref={canvasRef} width={600} height={600} className="wheel-canvas" />
            <button
                onClick={startSpin}
                disabled={spinning || names.length === 0}
                style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    background: spinning ? '#ccc' : '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}>
                {spinning ? 'Spinning...' : 'Spin'}
            </button>
        </div>
    );
};

export default Wheel;
