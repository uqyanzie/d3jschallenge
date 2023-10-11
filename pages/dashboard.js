import React, { useState, useEffect } from 'react'
import * as d3 from 'd3';


export default function Dashboard() {
    const [data, setData] = useState([])

    const selectFile = () => {
        const input = document.getElementById('jsonFileInput');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = function () {
            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = function (e) {
                const content = e.target.result;
                const jsonData = JSON.parse(content);
                const jsonContent = document.getElementById('jsonContent');
                jsonContent.textContent = JSON.stringify(jsonData, null, 2);
                console.log("INI FILE", jsonData)
                setData(jsonData)
            };
            reader.readAsText(file);
        };
        input.click();
    }

    var customColors = ['#83d68a', '#4d18c4', '#9737bc', '#f9a193', '#17ab04', '#7d23c9', '#cab848', '#4b5a23', '#406760', '#59df4e',
        '#fb89d4', '#c128d1', '#35edbf', '#15ee6e', '#9896a3', '#7d2670', '#a13236', '#5f1065', '#994fd1', '#a2c427',
        '#f9b75a', '#464891', '#a1292d', '#f87de1', '#7ea5e8', '#509ceb', '#5aa6c4', '#03d0e3', '#cf2294', '#99bea3',
        '#3125de', '#292a59', '#ebf8a1', '#97e5cd', '#b10dd1', '#48183a', '#b87aa3', '#8467cb', '#f4ed82', '#0d1850',
        '#0bc252', '#64b4ac', '#9600f1', '#ed16fc', '#4eb5b4', '#6d5903', '#45135c', '#e3e4aa', '#02a26a', '#ba1b98',
        '#0f6e4c', '#0104d5', '#62657c', '#1e70e9', '#a7d5fb', '#b09dcf', '#2b21ed', '#7e2256', '#c2300a', '#bc10b5',
        '#a70793', '#df605d', '#91ea62', '#14c24f', '#256db5', '#a3bd17', '#acc495', '#ae8b4b', '#15c72a', '#4983c7',
        '#b34c34', '#9e52ab', '#15568b', '#5939a8', '#921c57', '#eeebc5', '#e7c03e', '#a1a8e0', '#9bf938', '#a0d9fb',
        '#3e3cdd', '#3c4a7f', '#340aa0', '#25a606', '#61a948', '#46283a', '#34ba51', '#c6f69f', '#949acd', '#58a7e6',
        '#741aa6', '#69ff52', '#c30af5', '#f65a12', '#13d861', '#1a131b', '#1f0575', '#363438', '#793d32', '#c9d18e'
    ];
    useEffect(() => {
        if (data) {
            ShowDiagram(data)
        }
    }, [data])

    const ShowDiagram = (data) => {
        var dataArray = data.data;
        if (Array.isArray(dataArray)) {
            var nodes = [];
            var links = [];
            var nodeMap = {};

            dataArray.forEach(function (item) {
                if (!nodeMap.hasOwnProperty(item[0])) {
                    nodes.push(item[0]);
                    nodeMap[item[0]] = nodes.length - 1;
                }

                if (!nodeMap.hasOwnProperty(item[1])) {
                    nodes.push(item[1]);
                    nodeMap[item[1]] = nodes.length - 1;
                }

                links.push({
                    source: nodeMap[item[0]],
                    target: nodeMap[item[1]],
                    value: item[2]
                });
            });

            var width = 1700;
            var height = 1700;
            var nodeSpacing = 30;
            var totalNodeHeight = nodes.length * nodeSpacing;
            var startY = (height - totalNodeHeight) / 2;

            var svg = d3.select("#container").append("svg")
                .attr("width", width)
                .attr("height", height);
            var nodeValues = {};
            dataArray.forEach(function (item) {
                nodeValues[item[0]] = (nodeValues[item[0]] || 0) + item[2];
                nodeValues[item[1]] = (nodeValues[item[1]] || 0) + item[2];
            });
            // Create arcs for links
            var linkElements = svg.selectAll(".link")
                .data(links)
                .enter().append("path")
                .attr("class", "link")
                .attr("d", function (d) {
                    return [
                        "M", width / 2, startY + d.source * nodeSpacing,
                        "A", Math.abs(d.source - d.target) * nodeSpacing / 2, Math.abs(d.source - d.target) * nodeSpacing / 2,
                        0, 0, d.source < d.target ? 0 : 1, width / 2, startY + d.target * nodeSpacing
                    ].join(" ");
                })
                .style("stroke", function (d) {
                    return customColors[d.source % customColors.length];
                });

            // Add title to the links
            linkElements.append("title")
                .text(function (d) {
                    return nodes[d.source] + " → " + nodes[d.target] + ": " + d.value;
                });

            // Hover functionality for links
            linkElements.on("mouseover", function (event, d) {
                d3.select(this).style("stroke-width", "3px");
            })
                .on("mouseout", function (event, d) {
                    d3.select(this).style("stroke-width", "2px");
                });

            var nodeDegree = {};
            links.forEach(function (link) {
                nodeDegree[link.source] = (nodeDegree[link.source] || 0) + link.value;
                nodeDegree[link.target] = (nodeDegree[link.target] || 0) + link.value;
            });

            // Create nodes
            var nodeElements = svg.selectAll(".node")
                .data(nodes)
                .enter().append("circle")
                .attr("class", "node")
                .attr("r", function (d, i) {
                    return (nodeDegree[i] || 1) * 2; // Radius is multiplied by the degree
                })
                .attr("cx", width / 2)
                .attr("cy", function (d, i) {
                    return startY + i * nodeSpacing;
                })
                .style("fill", function (d, i) {
                    return customColors[i % customColors.length];
                });
            // Add titles to nodes for hover functionality
            nodeElements.append("title")
                .text(function (d) {
                    return d;
                });


            // Add titles to links for hover functionality
            linkElements.append("title")
                .text(function (d) {
                    return nodes[d.source] + " → " + nodes[d.target] + ": " + d.value;
                });
            // Node labels
            svg.selectAll(".label")
                .data(nodes)
                .enter().append("text")
                .attr("class", "label")
                .attr("x", (width) - 650)
                .attr("y", function (d, i) {
                    return startY + i * nodeSpacing + 5;
                }) // Adjust for vertical alignment
                .attr("text-anchor", "end")
                .attr("transform", "rotate(0," + (width / 2 - 10) + "," + (height / 2) + ")")
                .text(function (d) {
                    return d;
                });

            // Legend rendering using D3's data binding
            var legendContainer = d3.select("#legend").append("div").attr("class", "legend-grid");

            legendContainer.selectAll(".legend-item")
                .data(nodes)
                .enter().append("div")
                .attr("class", "legend-item")
                .each(function (d, i) {
                    var container = d3.select(this);
                    container.append("div")
                        .attr("class", "legend-color")
                        .style("background-color", customColors[i % customColors.length]);

                    container.append("div")
                        .attr("class", "legend-label")
                        .text(d);
                });
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">D3js Arc Demo</h1>
            <input id="jsonFileInput" type="file" style={{ display: 'none' }} />
            <div>
                <button onClick={() => selectFile()} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 15 }}>Upload JSON File</button>
            </div>

            <pre id="jsonContent"></pre>
            <div id="container"></div>
            <div id="legend"></div>
        </div>
    )
}
