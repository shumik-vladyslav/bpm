import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-dialog-create-model",
  templateUrl: "./dialog-create-model.component.html",
  styleUrls: ["./dialog-create-model.component.scss"]
})
export class DialogCreateModelComponent implements OnInit {
  label = ""
  deleteMode;
  dataArr;
  valid;
  saveId;
  constructor(public dialogRef: MatDialogRef<DialogCreateModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
  }

  validChange(e) {
    if (!e) {
      this.valid = false;
      return;
    }
    let res = this.dataArr.find(element => {
      return e === element.id;
    });

    if (!res) {
      this.valid = true;
    } else {
      this.valid = false;
    }

    if (this.label === 'Edit Model' && this.saveId === e) {
      this.valid = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onKeyDown(e) {
    let re = /^(\d*[a-zA-Z]*\d*[a-zA-Z]*)*$/mg;
    if (!re.test(e.key)){
      return false;
    }
  }
}
