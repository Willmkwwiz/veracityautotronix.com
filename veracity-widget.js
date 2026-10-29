/* ==========================================================
   VERACITY AUTOTRONIX - BATTERY FINDER & BOOKING WEB COMPONENT
   File: veracity-widget.js
   ========================================================== */

class VeracityWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Internal State
    this.activeTab = 'finder'; // 'finder' or 'booking'
    this.supabaseClient = null;
  }

  connectedCallback() {
    this.render();
    this.initSupabase();
    this.attachEventListeners();
  }

  initSupabase() {
    // Replace with your active credentials
    const SUPABASE_URL = 'https://kfffkzvpyiaxiavio.supabase.co';
    const SUPABASE_ANON_KEY = 'YOUR_ACTUAL_SUPABASE_ANON_KEY';

    if (window.supabase) {
      this.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
      console.warn('Supabase SDK not loaded on host page.');
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #ffffff;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .widget-container {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
        }

        .tabs-nav {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 12px;
        }

        .tab-btn {
          flex: 1;
          padding: 10px 14px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-btn.active,
        .tab-btn:hover {
          background: #00d26a;
          color: #000000;
          border-color: #00d26a;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 11px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 6px;
          font-weight: 600;
        }

        .form-control,
        .form-select {
          width: 100%;
          padding: 12px 14px;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #ffffff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: #00d26a;
        }

        .form-select option {
          background: #0f172a;
          color: #ffffff;
        }

        .btn-submit {
          width: 100%;
          padding: 12px;
          background: #00d26a;
          color: #000000;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s ease;
          margin-top: 6px;
        }

        .btn-submit:hover {
          background: #00b359;
        }

        .tab-content {
          display: none;
        }

        .tab-content.active {
          display: block;
        }

        .status-msg {
          margin-top: 12px;
          font-size: 13px;
          text-align: center;
        }

        @media (max-width: 480px) {
          .widget-container {
            padding: 14px;
          }
          .tab-btn {
            font-size: 12px;
            padding: 8px;
          }
        }
      </style>

      <div class="widget-container">
        <!-- Navigation Tabs -->
        <div class="tabs-nav">
          <button class="tab-btn active" data-tab="finder">Battery Finder</button>
          <button class="tab-btn" data-tab="booking">Book Service</button>
        </div>

        <!-- Tab 1: Battery Finder -->
        <div class="tab-content active" id="tab-finder">
          <div class="form-group">
            <label>Filter By Application</label>
            <select class="form-select" id="appFilter">
              <option value="automotive">Automotive</option>
              <option value="solar">Solar / Deep Cycle</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
          </div>
          <div class="form-group">
            <label>Search Model / Brand</label>
            <input type="text" class="form-control" id="batterySearch" placeholder="e.g. Willard, 619, YTX9..." />
          </div>
          <button class="btn-submit" id="searchBtn">Search Batteries</button>
          <div id="searchResults" style="margin-top: 16px;"></div>
        </div>

        <!-- Tab 2: Service Booking -->
        <div class="tab-content" id="tab-booking">
          <form id="bookingForm">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" class="form-control" name="name" placeholder="John Doe" required />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" class="form-control" name="phone" placeholder="+265..." required />
            </div>
            <div class="form-group">
              <label>Vehicle Model</label>
              <input type="text" class="form-control" name="vehicle" placeholder="e.g. Toyota Hilux" required />
            </div>
            <div class="form-group">
              <label>Service Required</label>
              <select class="form-select" name="service">
                <option value="Battery Testing & Fitment">Battery Testing & Fitment</option>
                <option value="Auto Electrical Diagnostics">Auto Electrical Diagnostics</option>
                <option value="Solar Installation Advice">Solar Installation Advice</option>
              </select>
            </div>
            <button type="submit" class="btn-submit">Submit Booking</button>
          </form>
          <div class="status-msg" id="bookingStatus"></div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const shadow = this.shadowRoot;

    // Tab Switching Logic
    shadow.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        shadow.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        shadow.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        const targetTab = e.target.getAttribute('data-tab');
        e.target.classList.add('active');
        shadow.getElementById(`tab-${targetTab}`).classList.add('active');
      });
    });

    // Booking Form Submission to Supabase
    const form = shadow.getElementById('bookingForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusDiv = shadow.getElementById('bookingStatus');
      statusDiv.style.color = '#94a3b8';
      statusDiv.textContent = 'Submitting your booking...';

      const formData = new FormData(form);
      const bookingData = {
        full_name: formData.get('name'),
        phone_number: formData.get('phone'),
        vehicle_model: formData.get('vehicle'),
        service_type: formData.get('service')
      };

      if (!this.supabaseClient) {
        statusDiv.style.color = '#ef4444';
        statusDiv.textContent = 'Database connection error. Please try again later.';
        return;
      }

      const { data, error } = await this.supabaseClient
        .from('service_bookings')
        .insert([bookingData]);

      if (error) {
        statusDiv.style.color = '#ef4444';
        statusDiv.textContent = `Error: ${error.message}`;
      } else {
        statusDiv.style.color = '#00d26a';
        statusDiv.textContent = 'Booking submitted successfully! We will contact you shortly.';
        form.reset();
      }
    });
  }
}

// Define the custom HTML element
customElements.define('veracity-battery-widget', VeracityWidget);
