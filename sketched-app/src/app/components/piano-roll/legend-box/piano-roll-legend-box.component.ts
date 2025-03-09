import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-piano-roll-legend-box',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Keyboard shortcut hints -->
    <div class="keyboard-shortcuts">
      <strong>{{ isPencilMode ? 'Pencil Mode' : 'Selection Mode' }} Controls:</strong>
      <ul *ngIf="!isPencilMode">
        <li>Click - Select note</li>
        <li>Ctrl+Click - Add/remove from selection</li>
        <li>Click & drag empty space - Select multiple notes</li>
        <li>Double-click on empty space - Create note</li>
        <li>Double-click on note - Delete note</li>
        <li>Delete/Backspace - Delete selected notes</li>
        <li>Drag note - Move selected notes</li>
        <li>Drag handle - Resize selected notes</li>
      </ul>
      <ul *ngIf="isPencilMode">
        <li>Click empty space - Create note</li>
        <li>Click note - Delete note</li>
        <li>Click & drag - Create note with length</li>
      </ul>
    </div>
  `,
  styles: `
    // Keyboard shortcut hint
    .keyboard-shortcuts {
      position: absolute;
      bottom: 10px;
      right: 10px;
      padding: 10px;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      border-radius: 4px;
      font-size: 12px;
      pointer-events: none;
      opacity: 0.7;

      ul {
        margin: 0;
        padding: 0 0 0 15px;
      }
    }
  `,
})
export class PianoRollLegendBoxComponent {
  @Input() isPencilMode = false;
}
