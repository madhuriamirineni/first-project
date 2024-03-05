import { Component,OnInit,inject } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { UserService } from '../user.service';
import { Post } from '../model/post';
import { ArticlesService } from '../articles.service';
import { User } from '../model/user';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

activatedRoute=inject(ActivatedRoute);
userService=inject(UserService);
currentUser:any;
articleService=inject(ArticlesService);
router=inject(Router);

isEditMode=false;

currentusername;
currentemail;
updatedUser:User;
userId;
editDetails;
editedUsername;
editedMail;

editForm=new FormGroup({
  username:new FormControl(),
  email:new FormControl()
})

onEditFormSubmit(){
  this.editDetails=this.editForm.value;
  this.editedUsername=this.editDetails.username;
  this.editedMail=this.editDetails.email;
  this.userId=this.currentUser.id;
  this.updatedUser={
    username:this.editedUsername,
    email:this.editedMail,
    password:this.currentUser.password
  }

  this.userService.updateUser(this.userId,this.updatedUser).subscribe(()=>{
    this.userService.getUserById(this.userId).subscribe((res)=>
    {
      this.currentusername=res[0].username;
      this.currentemail=res[0].email;
      this.isEditMode=false;
    })
  })
}

toggleEditMode(){
  this.isEditMode=!this.isEditMode;
}



articles:Post[];
selectedCategory:string='';

ngOnInit(): void {
  let username=this.activatedRoute.snapshot.paramMap.get('username')
  
  this.userService.getUserByUsername(username).subscribe(
    
    (userList)=>{
    this.currentUser=userList['payload'][0];
    this.currentusername=userList['payload'][0].username;
    this.currentemail=userList['payload'][0].email;
    },
    (error)=>{console.log(error)}
  );
  
}

navigateToArticleDetails(username:string,category:string):void{

  this.router.navigate([`/article-details/${username}/${category}`]);

}


}
