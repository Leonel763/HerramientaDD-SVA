import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  @Input() username: string = 'Administrador';
  @Input() myRole: string = '';
  @Input() currentTab: string = 'resumen';

  @Output() tabSelected = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

  selectTab(tab: string): void {
    this.tabSelected.emit(tab);
  }

  onLogout(): void {
    this.logout.emit();
  }
}
