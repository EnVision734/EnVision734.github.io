document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active menu item based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Calendar functionality
    const calendarGrid = document.querySelector('.calendar-grid');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const bookingForm = document.querySelector('.booking-form');
    const selectedDateElement = document.getElementById('selectedDate');
    const selectedTimeElement = document.getElementById('selectedTime');
    
    let currentDate = new Date();
    let selectedDate = null;
    let selectedTime = null;
    
    // Generate calendar
    function generateCalendar(year, month) {
        // Clear existing calendar days
        const dayElements = document.querySelectorAll('.calendar-day');
        dayElements.forEach(day => day.remove());
        
        // Set current month display
        const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
                           'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
        let firstDayOfWeek = firstDay.getDay();
        // Adjust for Monday as first day of week
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        
        // Create empty cells for days before first day of month
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day disabled';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Create cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Disable past dates
            const dateToCheck = new Date(year, month, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (dateToCheck < today) {
                dayElement.classList.add('disabled');
            } else {
                // Add click event for selectable dates
                dayElement.addEventListener('click', function() {
                    // Remove active class from previously selected day
                    document.querySelectorAll('.calendar-day.active').forEach(el => {
                        el.classList.remove('active');
                    });
                    
                    // Add active class to selected day
                    this.classList.add('active');
                    
                    // Set selected date
                    selectedDate = new Date(year, month, day);
                    selectedDateElement.textContent = `${day} ${monthNames[month]} ${year}`;
                    
                    // Show booking form
                    bookingForm.style.display = 'block';
                    
                    // Generate time slots (example)
                    generateTimeSlots();
                });
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    // Generate time slots for selected date
    function generateTimeSlots() {
        // This is a placeholder function
        // In a real implementation, you would fetch available time slots from a server
        // For now, we'll just set a default time
        selectedTime = "10:00";
        selectedTimeElement.textContent = selectedTime;
    }
    
    // Initialize calendar with current month
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    
    // Previous month button
    prevMonthButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });
    
    // Next month button
    nextMonthButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });
    
    // Handle booking form submission
    const bookingFormElement = document.getElementById('bookingForm');
    if (bookingFormElement) {
        bookingFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const bookingData = {
                name: formData.get('bookingName'),
                email: formData.get('bookingEmail'),
                phone: formData.get('bookingPhone'),
                company: formData.get('bookingCompany'),
                notes: formData.get('bookingNotes'),
                date: selectedDate,
                time: selectedTime
            };
            
            // Here you would typically send the data to a server
            console.log('Booking data:', bookingData);
            
            // Show confirmation message
            alert('Dziękujemy za rezerwację! Skontaktujemy się z Tobą wkrótce, aby potwierdzić szczegóły spotkania.');
            
            // Reset form
            this.reset();
            bookingForm.style.display = 'none';
            document.querySelectorAll('.calendar-day.active').forEach(el => {
                el.classList.remove('active');
            });
        });
    }
    
    // Handle contact form submission
    const contactFormElement = document.getElementById('contactForm');
    if (contactFormElement) {
        contactFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const contactData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message')
            };
            
            // Here you would typically send the data to a server
            console.log('Contact data:', contactData);
            
            // Show confirmation message
            alert('Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.');
            
            // Reset form
            this.reset();
        });
    }
});
