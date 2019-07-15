import {Component, OnInit} from '@angular/core';
import {FirebaseService} from './services/firebase.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog,MatTableDataSource} from '@angular/material';
import {User} from './models/user';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {AddDialogComponent} from './dialogs/add/add.dialog.component';
import {EditDialogComponent} from './dialogs/edit/edit.dialog.component';
import {DeleteDialogComponent} from './dialogs/delete/delete.dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  displayedColumns = ['id', 'name', 'role', 'region','actions'];
  dataSource = new MatTableDataSource([]);
  index: number;
  id: number;

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public firebaseService: FirebaseService) {}


  ngOnInit() {
    this.loadData();
  }


  addNew(user: User) {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: {user: user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.firebaseService.createUser(result)
    .then(
      res => {
        this.loadData();
       
      }
    )
      }
    });
  }

  startEdit(row) {
    this.id = row.payload.doc.id;
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: row.payload.doc.data()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.firebaseService.updateUser(this.id, result)
        .then(
          res => {
            this.loadData();
          }
        )
      }
    });
  }

  deleteItem(row) {
    this.id = row.payload.doc.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: row.payload.doc.data()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.firebaseService.deleteUser(this.id)
        .then(
          res => {
            this.loadData();
          },
          err => {
            console.log(err);
          }
        )
      }
    });
  }



  loadData(){
    this.firebaseService.getUsers()
    .subscribe(result => {
      this.dataSource = new MatTableDataSource(result);
    })
  }
}