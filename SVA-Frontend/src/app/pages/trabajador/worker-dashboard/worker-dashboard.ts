import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareaTrabajador } from "../tarea-trabajador/tarea-trabajador";

@Component({
  selector: 'app-worker-dashboard',
  standalone: true, 
  imports: [CommonModule, FormsModule, TareaTrabajador],
  templateUrl: './worker-dashboard.html',
  styleUrl: './worker-dashboard.css',
})
export class WorkerDashboardComponent {
}
