
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
@Component({
  selector: 'app-simple-dialog',
  imports: [FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,],
  templateUrl: './simple-dialog.component.html',
  styleUrl: './simple-dialog.component.scss'
})
export class SimpleDialogComponent {
constructor(
    public dialogRef: MatDialogRef<SimpleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SimpleDialogData
  ) {}

  onClose(result: boolean | null = null) {
    // 使用 null 表示只是關閉（info），true = 確認，false = 取消
    this.dialogRef.close(result);
  }
}
export interface SimpleDialogData {
  title?: string;
  message: string;
  // type 可為 'info' | 'confirm' | 'error'，決定按鈕顯示
  type?: 'info' | 'confirm' | 'error';
  confirmText?: string;
  cancelText?: string;
}
