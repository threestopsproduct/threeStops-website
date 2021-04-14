import React,{Component} from "react";

class MostPopular extends Component{
    render(){
        console.log(this.props.restaurant ,"this is product")
        return (
            <div>
                {this.props.restaurant &&this.props.restaurant.length > 0 ?
 <div className="row">
                    <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="col-12 py-3 bg-white" style={{border:"1px solid #999"}}>
                            <div className="mb-3">
                                <img src={this.props.restaurant.bannerImage} width="100%" className="gridImg" alt="" />
                            </div>
                            <h6 className="itemTitle mb-1">{this.props.restaurant.storeName}</h6>
                            <div className="catTitle mb-2">{this.props.restaurant.storeTypeMsg}</div>
                            <div className="row justify-content-between align-items-end">
                                <div className="col-auto pr-0">
                                    <span className="item-distance-Price"><img src="/static/images/loopz/btn-location.png"
                                            className="mr-1" width="10" height="14" alt="" /> {this.props.restaurant.distanceKm}</span>
                                    <span className="">.</span>
                                    <span className="item-distance-Price">{this.props.restaurant.currencySymbol} {this.props.restaurant.costForTwo} for two</span>
                                </div>
                                <div className="col-auto">
                                    <div className="itemRating">{this.props.restaurant.averageRating}</div>
                                </div>
                            </div>
                        </div>
                    </div>
              </div>
              :""}
            </div>
        )
    }
}
export default MostPopular