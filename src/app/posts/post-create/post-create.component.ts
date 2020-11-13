import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators,FormBuilder } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
//import { AuthService } from "../../auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  userName:string;
  flightStatus:string[]=["LANDED","ON SCHEDULE","DELAYED"];
  delete:boolean=false;


  private mode = "create";
  private postId: string;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
   // private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    // //this.authStatusSub = this.authService
    //   .getAuthStatusListener()
    //   .subscribe(authStatus => {
    //     this.isLoading = false;
    //   });
    this.form = new FormGroup({
      status: new FormControl(null, {validators: [Validators.required]}),
      flightCode: new FormControl(null, {validators: [Validators.required]}),
      flightProvider: new FormControl(null, { validators: [Validators.required] }),
      source: new FormControl(null, {validators: [Validators.required]}),
      destination: new FormControl(null, {validators: [Validators.required]}),
      sourceCode: new FormControl(null, {validators: [Validators.required]}),
      destinationCode: new FormControl(null, {validators: [Validators.required]}),
      arrivalDate: new FormControl(null, {validators: [Validators.required]}),
      departureDate: new FormControl(null, {validators: [Validators.required]}),
      arrivalTime: new FormControl(null, {validators: [Validators.required]}) 
    });


    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.delete=true;
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            status: postData.status,
            flightCode: postData.flightCode,
            flightProvider: postData.flightProvider,
            source: postData.source,
            destination:postData.destination,
            sourceCode:postData.sourceCode,
            destinationCode:postData.destinationCode,
            arrivalDate:postData.arrivalDate,
            departureDate:postData.departureDate,
            arrivalTime:postData.arrivalTime
          };
          let ArrDate = new Date (this.post.arrivalDate);
          let DepDate = new Date (this.post.arrivalDate)
          this.form.setValue({
            status: this.post.status,
            flightCode: this.post.flightCode,
            flightProvider: this.post.flightProvider,
            source:this.post.source,
            destination: this.post.destination,
            sourceCode: this.post.sourceCode,
            destinationCode: this.post.destinationCode,
            arrivalTime: this.post.arrivalTime,
            arrivalDate: ArrDate,
            departureDate: DepDate,
          
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });

   
  }



 

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.status,
        this.form.value.flightCode,
        this.form.value.flightProvider,
        this.form.value.source,
        this.form.value.sourceCode,
        this.form.value.destination,
        this.form.value.destinationCode,
        this.form.value.arrivalDate,
        this.form.value.departureDate,
        this.form.value.arrivalTime

      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.status,
        this.form.value.flightCode,
        this.form.value.flightProvider,
        this.form.value.source,
        this.form.value.sourceCode,
        this.form.value.destination,
        this.form.value.destinationCode,
        this.form.value.arrivalDate,
        this.form.value.departureDate,
        this.form.value.arrivalTime
      );
    }
    this.form.reset();
  }

  onDelete() {
    this.isLoading = true;
    this.postsService.deletePost(this.postId);
  }

  ngOnDestroy() {
   // this.authStatusSub.unsubscribe();
  }
}
