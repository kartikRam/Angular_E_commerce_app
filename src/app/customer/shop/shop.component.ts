import { Component, OnInit } from '@angular/core';
import { Product, ProductCart } from '../../models/dataTypes';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit{

  public shopProducts: Product[] | undefined
  public productDetails: Product | undefined
  public shopProductwithCart: ProductCart[] | undefined
  public productId: string | undefined
  public productQuantity: number = 1
  public removeCartLink: boolean = false
  public cartData: any
  public counter: number = 0
  // public shopProductsCart :boolean[] = new Array(2).fill(false);

  constructor(private shopService: ShopService){}

  ngOnInit(): void {
    this.shopService.trendyProducts().subscribe((res)=>{
      if(res && res.length){
        this.shopProducts = res
        // this.shopProductsCart = new Array(res.length).fill(false);
        this.shopProductwithCart = this.shopProducts.map(product => ({
          ...product,
          removeCart: false
        }));
      }
      
    })
    let user = localStorage.getItem('customer')
    if (user){
      this.shopService.getCartCount()
    }
  }
    addToCart(productId:string){
      this.productId = productId;
      this.productId && this.shopService.getProduct(this.productId).subscribe((res)=>{
            if(res){
              this.productDetails = res
            }
          })
      if(this.productDetails){
        
      console.log("in the fun");
        this.productDetails.quantity = this.productQuantity
        if(!localStorage.getItem('customer')){
          this.shopService.addToLocal(this.productDetails)
          this.changeCart(productId); 
        }else{
          this.productDetails && this.shopService.addToCart(this.productDetails).subscribe((res)=>{
            if(res){
              // console.log(res);
              this.shopService.getCartCount()
              this.changeCart(productId);
            }
          })
        }
      }
    }
    changeCart(productId:String){

      let i = 0;

      this.shopProductwithCart!.forEach(product => {
        if(product._id==productId){
          this.shopProductwithCart![i].removeCart= !this.shopProductwithCart![i].removeCart;
        }
        i=i+1;
      });
    }
    
    removeFromCart(productId:string){
      this.productId = productId;
      this.productId && this.shopService.getProduct(this.productId).subscribe((res)=>{
        if(res){
          this.productDetails = res
        }
      })
      if(this.productId){
        let user = localStorage.getItem('customer')
        if(!user){
          this.productId && this.shopService.removeFromLocal(this.productId)
          //this.removeCartLink = false
          this.changeCart(productId);
        }else{
          // console.log(this.productId);
          this.shopService.removeItemFromCart(this.productId).subscribe((res)=>{
          if(res){
            this.shopService.getCartCount();
            
            this.changeCart(productId);
          }
        })
        }
      }
    }
}
