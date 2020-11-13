import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';


import { Post } from "../post.model";
import { PostsService } from "../posts.service";
//import { AuthService } from "../../auth/auth.service";
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 8;
  currentPage = 1;
  pageSizeOptions = [1, 10, 11, 12];
  dataSource:any;
  requestedList:any=[];
  sharedList:any=[];
  myPosts:any=[];
  decodedToken:any;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  displayedColumns = ['time', 'flightProvider', 'status', 'terminal'];
  constructor(
    public postsService: PostsService,
   //private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: any; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        this.dataSource = postData.posts;  
      });
  }

 

 

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId);
  }

 

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    //this.authStatusSub.unsubscribe();
  }
}
