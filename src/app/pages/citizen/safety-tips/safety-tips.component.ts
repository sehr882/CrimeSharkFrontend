import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';

@Component({
  selector: 'app-safety-tips',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  template:
    `<app-back-button></app-back-button>
    <div class="center-wrapper">
    <div class="safety-wrapper">
      <h1>🛡️ Safety Tips</h1>
      <p class="intro">
        Stay alert. Stay informed. Stay safe with CrimeShark.
        CrimeShark helps you understand nearby risks and take smart actions.
        Follow these safety tips to reduce exposure to crime and respond effectively in critical situations.
      </p>

      <h2>🔴 Safety by Crime Type</h2>

      <div class="tip-section">
        <h3>🏴‍☠️ Robbery</h3>
        <ul>
          <li>Avoid using mobile phones in high-risk or crowded areas.</li>
          <li>Stay alert near ATMs, banks, and marketplaces.</li>
          <li>Walk confidently and be aware of your surroundings.</li>
          <li>If confronted, do not resist — personal safety comes first.</li>
          <li>Report incidents or suspicious behavior immediately.</li>
        </ul>
      </div>

      <div class="tip-section">
        <h3>🏠 Burglary</h3>
        <ul>
          <li>Lock all doors and windows, even for short periods.</li>
          <li>Use outdoor lighting or motion sensors when possible.</li>
          <li>Do not share travel plans publicly on social media.</li>
          <li>Inform trusted neighbors when leaving home.</li>
          <li>Report unfamiliar activity around residences.</li>
        </ul>
      </div>

      <div class="tip-section">
        <h3>💻 Cybercrime</h3>
        <ul>
          <li>Never share OTPs, passwords, or verification codes.</li>
          <li>Avoid clicking unknown links or messages offering rewards.</li>
          <li>Use strong, unique passwords for each account.</li>
          <li>Verify online sellers and buyers before transactions.</li>
          <li>Report scams under the Cybercrime category.</li>
        </ul>
      </div>

      <div class="tip-section">
        <h3>👤 Missing Person</h3>
        <ul>
          <li>Act immediately — do not wait.</li>
          <li>Share recent photos and last known location.</li>
          <li>Inform local authorities as soon as possible.</li>
          <li>Use CrimeShark to alert nearby users.</li>
          <li>Update the report once the person is found.</li>
        </ul>
      </div>

      <div class="tip-section">
        <h3>⚠️ Assault</h3>
        <ul>
          <li>Stay in well-lit and populated areas.</li>
          <li>Avoid confrontations with aggressive individuals.</li>
          <li>Trust your instincts and leave unsafe situations early.</li>
          <li>Keep emergency contacts easily accessible.</li>
          <li>Seek help from nearby people or shops if threatened.</li>
        </ul>
      </div>

      <h2>📍 Situation-Based Safety Tips</h2>

      <div class="tip-section">
        <h3>🚶 Walking Alone</h3>
        <ul>
          <li>Share your live location with a trusted contact.</li>
          <li>Avoid shortcuts through isolated or poorly lit areas.</li>
          <li>Keep headphones volume low.</li>
          <li>Stay alert and aware of movement around you.</li>
        </ul>
      </div>

      <div class="tip-section">
        <h3>🚗 While Driving</h3>
        <ul>
          <li>Keep vehicle doors locked at all times.</li>
          <li>Avoid stopping for strangers, especially at night.</li>
          <li>If followed, drive toward a crowded area or police station.</li>
          <li>Do not leave valuables visible inside the car.</li>
        </ul>
      </div>

      <div class="tip-section">
        <h3>🌙 At Night</h3>
        <ul>
          <li>Prefer traveling with others when possible.</li>
          <li>Use verified transport services.</li>
          <li>Inform someone before heading out.</li>
          <li>Avoid routes marked as hotspots on the CrimeShark map.</li>
        </ul>
      </div>

      <h2>🚨 Emergency Actions</h2>

      <div class="tip-section">
        <h3>If You Are in Immediate Danger</h3>
        <ul>
          <li>Move to a safe and crowded place.</li>
          <li>Contact local emergency services immediately.</li>
          <li>Use CrimeShark to report with exact location details.</li>
          <li>Stay calm and follow official instructions.</li>
        </ul>
      </div>

      <div class="tip-section">
        <h3>If You Witness a Crime</h3>
        <ul>
          <li>Do not intervene physically.</li>
          <li>Observe and remember key details (location, time, description).</li>
          <li>Report anonymously through CrimeShark.</li>
          <li>Assist authorities if requested.</li>
        </ul>
      </div>

      <h2>🧠 Smart Safety Habits</h2>
      <ul class="tip-section">
        <li>Check Live Alerts before going out.</li>
        <li>Avoid areas with repeated crime reports.</li>
        <li>Keep family and friends informed of your whereabouts.</li>
        <li>Educate others about safety awareness.</li>
        <li>Use anonymous reporting to protect your identity.</li>
      </ul>

      <h2>🔔 Stay Informed</h2>
      <p class="tip-section">
        Enable notifications to receive real-time alerts about incidents near your location.
        <br>
        CrimeShark — Empowering citizens through awareness and action.
      </p>
    </div>
    </div>
  `,
  styles: [`
    .center-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: radial-gradient(circle at top, #10263f 0%, #0b1c2d 60%);
      overflow: hidden;
    }

    .safety-wrapper {
      width: 100%;
      max-width: 1000px;
      height: 90vh;
      overflow-y: auto;
      padding: 40px;
      background: radial-gradient(circle at top, #10263f 0%, #0b1c2d 60%);
      border-radius: 20px;
      box-shadow: 0 0 40px rgba(0,0,0,0.7);
      color: #f0f0f0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    h1 {
      font-size: 36px;
      text-align: center;
      color: #00bfff;
      margin-bottom: 25px;
    }

    h2 {
      font-size: 28px;
      color: #ff6b6b;
      margin-top: 30px;
      margin-bottom: 15px;
    }

    h3 {
      font-size: 20px;
      color: #f0f0f0;
      margin-bottom: 10px;
    }

    .intro {
      font-size: 18px;
      text-align: center;
      margin-bottom: 30px;
      color: #ccc;
    }

    .tip-section ul {
      list-style-type: disc;
      margin-left: 20px;
    }

    .tip-section li {
      margin-bottom: 8px;
      font-size: 16px;
      line-height: 1.5;
    }

    /* Custom scrollbar */
    .safety-wrapper::-webkit-scrollbar {
      width: 8px;
    }

    .safety-wrapper::-webkit-scrollbar-thumb {
      background: #555;
      border-radius: 4px;
    }

    .safety-wrapper::-webkit-scrollbar-track {
      background: #2c2c2c;
    }
  `]
})
export class SafetyTipsComponent { }
