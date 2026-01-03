const THETA_MIN = 0;
const THETA_MAX = 180;
const PHI_MIN = 0;
const PHI_MAX = 360;
const R_MIN = 0;
const RHO_MIN = 0;


document.getElementById('coordinate-system').addEventListener('change', () => {
    document.getElementById('input-cartesian').classList.add('hidden');
    document.getElementById('input-spherical').classList.add('hidden');
    document.getElementById('input-cylindrical').classList.add('hidden');
    document.getElementById('results').classList.add('hidden');
    document.getElementById('convert-btn').classList.add('hidden');
    document.getElementById('error-message').classList.add('hidden');
    document.getElementById('error-message').textContent = '';

    const system = document.getElementById('coordinate-system').value;
    if (system != 'none') {
        document.getElementById(`input-${system}`).classList.remove('hidden');
        document.getElementById('convert-btn').classList.remove('hidden');
    }
});

document.getElementById('convert-btn').addEventListener('click', () => {
    const cs = document.getElementById('coordinate-system').value;
    const error = document.getElementById('error-message');
    const rsl = document.getElementById('results');
    const outCartesian = document.getElementById('result-cartesian').querySelector('.coords');
    const outSpherical = document.getElementById('result-spherical').querySelector('.coords');
    const outCylindrical = document.getElementById('result-cylindrical').querySelector('.coords');

    rsl.classList.add('hidden');
    error.classList.add('hidden');
    error.textContent = '';
    outCartesian.textContent = '';
    outSpherical.textContent = '';
    outCylindrical.textContent = '';

    const toRadians = deg => deg * Math.PI / 180;
    const toDegrees = rad => {
        let deg = rad * 180 / Math.PI;
        while (deg >= 360) deg -= 360;
        while (deg < 0) deg += 360;
        return deg;
    };

    const isValidInput = val => val != '' && val != null && !isNaN(parseFloat(val));

    let x, y, z, r, theta, phi, rho;
    let valid = true;
    let errorMsg = '';

    if (cs === 'none') {
        valid = false;
        errorMsg = 'Please select a coordinate system.';
    } else if (cs === 'cartesian') {
        x = document.getElementById('cartesian-x').value;
        y = document.getElementById('cartesian-y').value;
        z = document.getElementById('cartesian-z').value;
        if (!isValidInput(x) || !isValidInput(y) || !isValidInput(z)) {
            valid = false;
            errorMsg = 'All Cartesian inputs (x, y, z) must be valid numbers.';
        } else {
            x = parseFloat(x);
            y = parseFloat(y);
            z = parseFloat(z);
            r = Math.sqrt(x*x + y*y + z*z);
            rho = Math.sqrt(x*x + y*y);
            phi = toDegrees(Math.atan2(y, x));
            theta = r > 0 ? toDegrees(Math.acos(z / r)) : 0;
            if (isNaN(r) || isNaN(rho) || isNaN(theta) || isNaN(phi)) {
                valid = false;
                errorMsg = 'Computed values are undefined or out of bounds.';
            } else {
                r = r.toFixed(2);
                rho = rho.toFixed(2);
                theta = theta.toFixed(2);
                phi = phi.toFixed(2);
            }
        }
    } else if (cs === 'spherical') {
        r = document.getElementById('spherical-r').value;
        theta = document.getElementById('spherical-theta').value;
        phi = document.getElementById('spherical-phi').value;
        if (!isValidInput(r) || !isValidInput(theta) || !isValidInput(phi)) {
            valid = false;
            errorMsg = 'All Spherical inputs (r, θ, φ) must be valid numbers.';
        } else {
            r = parseFloat(r);
            theta = parseFloat(theta);
            phi = parseFloat(phi);
            if (r < R_MIN) {
                valid = false;
                errorMsg = 'Radius (r) must be non-negative.';
            } else if (theta < THETA_MIN || theta > THETA_MAX) {
                valid = false;
                errorMsg = 'Theta (θ) must be between 0° and 180°.';
            } else if (phi < PHI_MIN || phi > PHI_MAX) {
                valid = false;
                errorMsg = 'Phi (φ) must be between 0° and 360°.';
            } else {
                x = (r * Math.sin(toRadians(theta)) * Math.cos(toRadians(phi))).toFixed(2);
                y = (r * Math.sin(toRadians(theta)) * Math.sin(toRadians(phi))).toFixed(2);
                z = (r * Math.cos(toRadians(theta))).toFixed(2);
                rho = (r * Math.sin(toRadians(theta))).toFixed(2);
                if (isNaN(x) || isNaN(y) || isNaN(z) || isNaN(rho)) {
                    valid = false;
                    errorMsg = 'Computed values are undefined or out of bounds.';
                }
            }
        }
    } else if (cs === 'cylindrical') {
        rho = document.getElementById('cylindrical-rho').value;
        phi = document.getElementById('cylindrical-phi').value;
        z = document.getElementById('cylindrical-z').value;
        if (!isValidInput(rho) || !isValidInput(phi) || !isValidInput(z)) {
            valid = false;
            errorMsg = 'All Cylindrical inputs (ρ, φ, z) must be valid numbers.';
        } else {
            rho = parseFloat(rho);
            phi = parseFloat(phi);
            z = parseFloat(z);
            if (rho < RHO_MIN) {
                valid = false;
                errorMsg = 'Rho (ρ) must be non-negative.';
            } else if (phi < PHI_MIN || phi > PHI_MAX) {
                valid = false;
                errorMsg = 'Phi (φ) must be between 0° and 360°.';
            } else {
                x = (rho * Math.cos(toRadians(phi))).toFixed(2);
                y = (rho * Math.sin(toRadians(phi))).toFixed(2);
                r = Math.sqrt(rho*rho + z*z);
                theta = r > 0 ? toDegrees(Math.acos(z / r)) : 0;
                phi = phi;
                if (isNaN(x) || isNaN(y) || isNaN(r)) {
                    valid = false;
                    errorMsg = 'Computed values are undefined or out of bounds.';
                } else {
                    r = r.toFixed(2);
                    theta = theta.toFixed(2);
                }
            }
        }
    }

    if (!valid) {
        error.textContent = errorMsg;
        error.classList.remove('hidden');
        return;
    }

    rsl.classList.remove('hidden');
    outCartesian.textContent = `(x = ${x}, y = ${y}, z = ${z})`;
    outCylindrical.textContent = `(ρ = ${rho}, φ = ${phi}°, z = ${z})`;
    outSpherical.textContent = `(r = ${r}, θ = ${theta}°, φ = ${phi}°)`;
});