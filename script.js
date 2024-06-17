let shakingThreshold = 15; // Adjust sensitivity as needed
let isShaking = false;
let lastX = null, lastY = null, lastZ = null;
let rotation = 0; // Current rotation angle
let spinInterval = null; // Timer for rotation animation
let decelerationRate = 0.95; // Deceleration factor (0 < decelerationRate < 1)

document.getElementById('startButton').addEventListener('click', function() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleMotion);
                } else {
                    alert('Permiso denegado para acceder a los sensores de movimiento');
                }
            })
            .catch(console.error);
    } else {
        // For browsers that don't require explicit permission
        window.addEventListener('devicemotion', handleMotion);
    }
});

function handleMotion(event) {
    let acceleration = event.accelerationIncludingGravity;
    let currentX = acceleration.x;
    let currentY = acceleration.y;
    let currentZ = acceleration.z;

    if (lastX !== null && lastY !== null && lastZ !== null) {
        let deltaX = Math.abs(lastX - currentX);
        let deltaY = Math.abs(lastY - currentY);
        let deltaZ = Math.abs(lastZ - currentZ);

        if (deltaX > shakingThreshold || deltaY > shakingThreshold || deltaZ > shakingThreshold) {
            isShaking = true;
            if (!spinInterval) {
                startSpinning();
            }
        } else {
            isShaking = false;
            if (spinInterval) {
                stopSpinning();
            }
        }
    }

    lastX = currentX;
    lastY = currentY;
    lastZ = currentZ;
}

function startSpinning() {
    spinInterval = setInterval(() => {
        if (isShaking) {
            rotation += Math.random() * 5; // Randomize spin speed for a natural look
        } else {
            rotation *= decelerationRate; // Decelerate if not shaking
        }

        document.getElementById('ruleta').style.transform = `rotate(${rotation}deg)`;
    }, 10);
}

function stopSpinning() {
    clearInterval(spinInterval);
    spinInterval = null;
}
