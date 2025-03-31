// Simulated data (replace with database in real app)
let porters = [
    { id: 'P001', name: 'Ramesh Kumar', badge: 'B12345', platform: 1, available: true, currentBooking: null },
    { id: 'P002', name: 'Suresh Patel', badge: 'B12346', platform: 2, available: true, currentBooking: null }
];

let bookings = [];

function findAvailablePorter(station, platform, dateTime) {
    const requestedTime = new Date(dateTime).getTime();
    return porters.find(porter => {
        if (!porter.available || porter.platform !== parseInt(platform)) return false;
        if (!porter.currentBooking) return true;
        const bookingTime = new Date(porter.currentBooking.dateTime).getTime();
        return Math.abs(requestedTime - bookingTime) > 60 * 60 * 1000; // 1-hour gap
    });
}

function assignBooking(booking) {
    const porter = findAvailablePorter(booking.station, booking.platform, booking.dateTime);
    if (!porter) {
        return { success: false, message: 'No available porters at this time.' };
    }

    const duplicate = bookings.find(b => 
        b.customerEmail === booking.customerEmail && 
        new Date(b.dateTime).getTime() === new Date(booking.dateTime).getTime()
    );
    if (duplicate) {
        return { success: false, message: 'You already have a booking at this time.' };
    }

    booking.id = `B${bookings.length + 1}`;
    booking.status = 'Assigned';
    booking.porterId = porter.id;
    booking.otp = Math.floor(100000 + Math.random() * 900000).toString();
    porter.available = false;
    porter.currentBooking = booking;
    bookings.push(booking);
    return { success: true, porter: { name: porter.name, badge: porter.badge }, otp: booking.otp };
}

function acceptBooking(porterId, bookingId, otp) {
    const booking = bookings.find(b => b.id === bookingId && b.porterId === porterId);
    if (!booking || booking.otp !== otp) {
        return { success: false, message: 'Invalid booking or OTP.' };
    }
    booking.status = 'Accepted';
    return { success: true };
}

function rejectBooking(porterId, bookingId) {
    const booking = bookings.find(b => b.id === bookingId && b.porterId === porterId);
    if (!booking || booking.status !== 'Assigned') {
        return { success: false, message: 'Booking not found or already accepted.' };
    }
    const porter = porters.find(p => p.id === porterId);
    porter.available = true;
    porter.currentBooking = null;
    booking.porterId = null;
    booking.status = 'Pending';
    const result = assignBooking(booking);
    return result;
}

function completeBooking(porterId, bookingId) {
    const booking = bookings.find(b => b.id === bookingId && b.porterId === porterId);
    if (!booking || booking.status !== 'Accepted') {
        return { success: false, message: 'Booking not found or not accepted.' };
    }
    booking.status = 'Completed';
    const porter = porters.find(p => p.id === porterId);
    porter.available = true;
    porter.currentBooking = null;
    return { success: true, charges: booking.weight * 50 + (booking.trolley ? 50 : 0) };
}

window.porterLogic = { assignBooking, acceptBooking, rejectBooking, completeBooking, bookings, porters };