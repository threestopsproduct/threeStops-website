import React,{Component} from "react";
import redirect from "../../../lib/redirect";
import { setCookie, getCookie } from "../../../lib/session";
class PopularCategories extends Component{
    handleRedirect=(type)=>{
        redirect(`/${this.props.cityName}/stores`)
       setCookie("cname",type.categoryName)
       
    }
    render(){
        console.log(this.props.productList,"PopularCategories")
        return (
            <div>
                
 <div className="row justify-content-center">
 {this.props.productList && this.props.productList.categoryData &&this.props.productList.categoryData.map(item =>{
     return(
        <div className="col-12 col-sm-4 col-md-4 col-xl-auto" onClick={()=>this.handleRedirect(item)}>
        <div className="mb-2">
            <img src={item.bannerImage} width="100%" className="catImg" alt="" />
        </div>
        <p className="fnt14 lightGreyClr mb-0 text-center fntWght500">{item.categoryName}</p>
    </div>
     )
   
 })}
                    
                   
                </div>
            </div>
        )
    }
}
export default PopularCategories