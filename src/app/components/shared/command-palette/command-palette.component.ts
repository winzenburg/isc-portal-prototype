import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommandPaletteService, Command, CommandGroup } from '../../../services/command-palette.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-command-palette',
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.scss']
})
export class CommandPaletteComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  isOpen = false;
  searchQuery = '';
  filteredCommands: Command[] = [];
  selectedIndex = 0;

  private destroy$ = new Subject<void>();

  constructor(public commandService: CommandPaletteService) {}

  ngOnInit(): void {
    this.commandService.isOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOpen => {
        this.isOpen = isOpen;
        if (isOpen) {
          this.searchQuery = '';
          this.updateFilteredCommands();
          setTimeout(() => this.searchInput?.nativeElement.focus(), 100);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    // Open palette with Cmd+K or Ctrl+K
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.commandService.toggle();
      return;
    }

    // Only handle these keys when palette is open
    if (!this.isOpen) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.selectNext();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.selectPrevious();
        break;

      case 'Enter':
        event.preventDefault();
        this.executeSelected();
        break;
    }
  }

  onSearchChange(): void {
    this.selectedIndex = 0;
    this.updateFilteredCommands();
  }

  private updateFilteredCommands(): void {
    if (this.searchQuery.trim()) {
      this.filteredCommands = this.commandService.searchCommands(this.searchQuery);
    } else {
      // Show recent commands first, then all commands
      const recent = this.commandService.getRecentCommands();
      const all = this.commandService.getAllCommands();

      // Create recent commands with special group
      const recentWithGroup = recent.map(cmd => ({ ...cmd, group: 'recent' as CommandGroup }));

      // Filter out recent from all commands
      const nonRecent = all.filter(cmd => !recent.find(r => r.id === cmd.id));

      this.filteredCommands = [...recentWithGroup, ...nonRecent];
    }
  }

  getCommandsByGroup(): Array<{ key: string; value: Command[] }> {
    const grouped = new Map<string, Command[]>();

    this.filteredCommands.forEach(cmd => {
      const groupId = cmd.group;
      if (!grouped.has(groupId)) {
        grouped.set(groupId, []);
      }
      grouped.get(groupId)!.push(cmd);
    });

    // Sort groups by priority and convert to array
    const sortedGroups = Array.from(grouped.entries())
      .sort((a, b) => {
        const groupA = this.commandService.groups.find(g => g.id === a[0]);
        const groupB = this.commandService.groups.find(g => g.id === b[0]);
        return (groupA?.priority || 999) - (groupB?.priority || 999);
      })
      .map(([key, value]) => ({ key, value }));

    return sortedGroups;
  }

  getGroupLabel(groupId: string): string {
    return this.commandService.groups.find(g => g.id === groupId)?.label || groupId;
  }

  selectNext(): void {
    if (this.selectedIndex < this.filteredCommands.length - 1) {
      this.selectedIndex++;
      this.scrollToSelected();
    }
  }

  selectPrevious(): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      this.scrollToSelected();
    }
  }

  selectCommand(index: number): void {
    this.selectedIndex = index;
  }

  executeSelected(): void {
    const command = this.filteredCommands[this.selectedIndex];
    if (command) {
      this.execute(command);
    }
  }

  execute(command: Command): void {
    this.commandService.executeCommand(command);
  }

  close(): void {
    this.commandService.close();
  }

  onBackdropClick(): void {
    this.close();
  }

  private scrollToSelected(): void {
    // Scroll the selected item into view
    setTimeout(() => {
      const selectedElement = document.querySelector('.command-item.selected');
      selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 0);
  }

  // Prevent backdrop click from closing when clicking inside dialog
  onDialogClick(event: Event): void {
    event.stopPropagation();
  }

  getCommandIndex(command: Command): number {
    return this.filteredCommands.indexOf(command);
  }
}
