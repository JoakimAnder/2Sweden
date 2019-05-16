import React from "react"
import Route from "../Route"
import { get_r2r, get_CC } from "../../tools/DAO"

export default class Main extends React.Component {
    constructor() {
        super()
        this.state = {
            routes: [],
            currencyCode:"$$$",
            localCurrency:null
        }

        this.search = this.search.bind(this)
        this.sortRoutes = this.sortRoutes.bind(this)
    }
    componentDidMount(){
      
    get_CC(curr => {
        this.setState({localCurrency:curr})
    })
       
        
    
}

    render() {
        let i = 0; //Each Route needs a unique key.
        return (

            <main className="main-div">

                <div className="container search">
                 <form onSubmit={this.search}>
                    <div className="row sm-flex">
                        <div className="col-lg-3 col-md-6">
                             
                                <input
                                     required
                                     placeholder="🔍From"
                                     name="origin"
                                     className="search"
                                />
                             
                      
                        </div>
                    
                        <div className="col-lg-9 col-md-6">
                            
                                 <select name="destination" className="select" >
                                     <option value="stockholm">Stockholm</option>
                                    <option value="are">Åre</option>
                                    <option value="falun">Falun</option>
                                </select>
                           
                      
                        </div>
                    
                         <div className="col-lg-3 col-md-6">
                                <label className="date">
                                 Departure date<br/>
                                <input type="date"/>
                                </label>
                         </div>
                        <div className="col-lg-2 col-md-6">
                                <label className="date">Going home date<br/>
                                    <input type="date"/>
                                </label>
                        </div> 
                        <div className="col-lg-7">
                                {/* för att flytta ner olympiska schemat */}
                                
                                    <select name="currencyCode">
                                        <option value={this.state.localCurrency}>{`Local currency(${this.state.localCurrency})`}</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="CAD">CAD</option>
                                        <option value="CHF">CHF</option>
                                        <option value="GBP">GBP</option>
                                        <option value="HUF">HUF</option>
                                        <option value="NOK">NOK</option>
                                        <option value="PLN">PLN</option>
                                        <option value="SEK">SEK</option>
                                    </select>
                               
                        
                        </div> 
                         <div className="col-lg-3 col-md-6">
                             <a href="#" className="schedule">See the Olympic Schedule</a>
                        </div>
                        <div className="col-lg-9 col-md-6">
                        
                        <button type="submit" className="btn btn-primary btn btn-main ">Search</button>
                       
                         </div>
                         
                    </div>

                    </form>
                    <div className="col-lg-9 col-md-6">
                    <select id="sortBy" onChange={this.sortRoutes}>
                        <option value="sort">Sort By</option>
                        <option value="duration">Duration</option>
                        <option value="price">Price</option>
                        <option value="connections">Connections</option>
                    </select>
                    </div>
                </div>

                <div className="routes">                

                    <table className="table table-dark">
                        <thead >
                            <tr className="segment title">
                            
                                <th scope="col">From --> To </th>
                                <th scope="col">Transport </th>
                                <th scope="col">Duration </th>
                                <th scope="col">Price({this.state.currencyCode}) </th>
                            </tr>
                        </thead>
                       

                            {this.state.routes.map(r => {
                                return <Route
                                    key={i++}
                                    dataKey={i}
                                    currency={r.currency}
                                    segments={r.segments}
                                    duration={r.duration}
                                    price={r.price}
                                    origin={r.startPoint}
                                    destination={r.endPoint}

                                />
                            })}
                       
                    </table>
                
                </div>
        </main>
        )
    }

    sortRoutes() {
        // Sorts state.routes depending on value of element with id: "sortBy"
        let sortAlg
        switch (document.getElementById("sortBy").value) {
            case "duration":
                sortAlg = (r1, r2) => r1.duration - r2.duration
                break
            case "price":
                sortAlg = (r1, r2) => r1.price - r2.price
                break
            case "connections":
                sortAlg = (r1, r2) => r1.segments.length - r2.segments.length
                break
            default:
                sortAlg = (r1, r2) => r1.duration - r2.duration
        }

        let sortedList = this.state.routes.sort(sortAlg)

        this.setState({
            routes: sortedList
        })
    }

    search(form) {
        form.preventDefault()

        let destination = form.target.elements["destination"].value
        let origin = String(form.target.elements["origin"].value).trim()
        let currencyCode = form.target.elements["currencyCode"].value
        

        if (origin === "") {
            // If origin field is empty, do nothing.
            form.target.elements["origin"].value = origin
            return
        }
        
        get_r2r(origin, destination, currencyCode, data => {
            console.log(this.state.localCurrency)
            this.setState({
                routes: data.routes,
                start: data.start,
                dest: data.dest,
                currencyCode:data.currencyCode

            })
            this.sortRoutes()
        })
    
}
}