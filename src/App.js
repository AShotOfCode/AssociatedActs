import React, {Component} from 'react';
import './App.css';
import $ from 'jquery'


let title = "J._Cole"
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rappers: [],
            names: {"nodes" : [{name: 'Erkan', group: 1}, {name: 'Jophy', group: 1}, {name: 'Aaron', group: 1}, {name: 'Lauren', group: 2}]},
            links: {"links" : [
                    {
                        "source": 0,
                        "target": 1,
                        "value": 2
                    }, {
                        "source": 1,
                        "target": 0,
                        "value": 2
                    }, {
                        "source": 1,
                        "target": 2,
                        "value": 2
                    }
                ]},
            loaded: false

        }
    }
    componentDidMount() {
        let tempRappers = []
        let url = "http://dbpedia.org/sparql"
        let query = "select ?z where {<http://dbpedia.org/resource/" + title + "> dbo:associatedMusicalArtist ?z}"
        let queryUrl = encodeURI(url + "?query=" + query + "&format=json")
        $.get(queryUrl).then(data => {
            for (let value of data.results.bindings) {
                tempRappers.push(value.z.value.split("http://dbpedia.org/resource/")[1])
            }
        }).then(data => {
            this.setState({rappers: tempRappers, loaded: true})
        })
    }
    drawD3() {
      console.log(this.state)
        let names = this.state.names
        let links = this.state.links
        //d3 function to draw
        var width = 960
        var height = 500
        console.log(d3)
        var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);
        var force = d3.layout.force().gravity(0.05).distance(100).charge(-100).size([width, height]);
        force.nodes(names.nodes).links(links.links).start();
        var link = svg.selectAll(".link").data(links.links).enter().append("line").attr("class", "link");
        var node = svg.selectAll(".node").data(names.nodes).enter().append("g").attr("class", "node").call(force.drag);
        node.append("image").attr("xlink:href", "https://github.com/favicon.ico").attr("x", -8).attr("y", -8).attr("width", 16).attr("height", 16);
        node.append("text").attr("dx", 12).attr("dy", ".35em").text(function(d) {
            return d.name
        });
        force.on("tick", function() {
            link.attr("x1", function(d) {
                return d.source.x;
            }).attr("y1", function(d) {
                return d.source.y;
            }).attr("x2", function(d) {
                return d.target.x;
            }).attr("y2", function(d) {
                return d.target.y;
            });
            node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        })

    }
    render() {
      if (this.state.loaded)
        return (
            <div className="App">
              {this.drawD3()}
            </div>
        );
      else
        return(
          <div></div>
        )
    }
}

export default App;
