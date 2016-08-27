import React, {Component} from 'react';
import './App.css';
import $ from 'jquery'

let title = "J._Cole"
class App extends Component {
    constructor(props) {
      super(props)
      this.state = {
        rappers: [],
      }
    }
    componentDidMount(){
      let tempRappers = []
      let url = "http://dbpedia.org/sparql"
      let query = "select ?z where {<http://dbpedia.org/resource/" + title + "> dbo:associatedMusicalArtist ?z}"
      let queryUrl = encodeURI(url + "?query=" + query + "&format=json")
      $.get(queryUrl).then(data => {
              for (let value of data.results.bindings){
                  tempRappers.push(value.z.value.split("http://dbpedia.org/resource/")[1])
                }
          }).then(data => {
            this.setState({
              rappers: tempRappers
            })
          })
    }
    getRappers() {
        return (
            <ul>
                {this.state.rappers.map(function(name, index){
                    return <li key={ index }>{name}</li>;
                  })}
            </ul>
        )
    }
    render() {
        return (
            <div className="App">
                {this.getRappers()}
            </div>
        );
    }
}

export default App;
