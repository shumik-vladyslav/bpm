import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ComponentClass } from '../shared/model/component.mode';
declare var d3;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  types = [
    "Data Model",
    "Audit Rules",
    "Contextual Rules",
    "Role type x",
    // "Board"
  ];

  colors = {
    "Data Model": "#fec003",
    "Audit Rules": "#ff0300",
    "Contextual Rules": "#93d052",
    "Role type x": "#d9edf8",
  }
  text = {
    "Data Model": "#000",
    "Audit Rules": "#fff",
    "Contextual Rules": "#fff",
    "Role type x": "#000",
  }

  picture;
  zoom;
  zoomTrans;
  conteiner;
  dragType;
  isStart;
  vis;
  data = [];
  start_x;
  start_y;
  activeArrow;
  selected;
  startDrowLine;
  marker;
  modelId;
  showSide;
  selectedModal;
  optionsModal = {};
  dragSelected;
  user;
  modelList;
  setInterval;
  formulaSaverOld = {};
  saverComponent = [];
  modelsKeys = {};
  dataCopy;
  selectedModalObj;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.init();
  }
  slider;
  init() {
    this.menuInit();

    this.zoom = d3
    .zoom()
    .scaleExtent([0.1, 2])
    .on("zoom", () => {
      this.zoomTrans = d3.event.transform;
      // this.conteiner.attr("transform", d3.event.transform);
      const currentTransform = d3.event.transform;
      if (!currentTransform.x) {
        currentTransform.x = 0;
        currentTransform.y = 0;
      }
      this.conteiner.attr("transform", currentTransform);
      this.slider.property("value", currentTransform.k);
      this.rangeWidth();

    });
  this.vis = d3.select("#graph").append("svg");
  var w = "100%",
    h = "100%";
  this.vis
    .attr("width", w)
    .attr("height", h)
    .on("click", () => {
      // if (!this.readOnly) {
      //   this.unselect();

      if (this.startDrowLine) {
        this.removeAll();
        this.startDrowLine = null;
        this.activeArrow = null;
        document.documentElement.style.cursor = "default";
        this.drow();
      }

      // if (!this.clickArrow) {
      //   this.unselectArrow();
      // }


    });
  this.vis.call(this.zoom).on("dblclick.zoom", null);

  this.conteiner = this.vis.append("g").attr("id", "wrap");
  let g = d3
    .select("#graph")
    .append("div")
    .datum({})
    .attr("class", "coco-bpm-d3-zoom-wrap");
  let g1 = g;
  let icon1 = g1
  .append("svg")
  .attr("width", "14")
  .attr("height", "14")
  .attr("viewBox", "0 0 14 14")
  .on("click", () => {
    // this.undo();
  })
  .append("g")
  .attr("fill", "#2196F3")
  .attr("transform", "translate(-384.000000, -144.000000)")
  .attr("fill-rule", "nonzero");

  icon1
    .append("path")
    .attr(
      "d",
      "M391.5,157 C389.014719,157 387,154.985281 387,152.5 C387,152.331018 387.009314,152.164211 387.027464,152 L385.018945,152 C385.00639,152.165053 385,152.33178 385,152.5 C385,156.089851 387.910149,159 391.5,159 C395.089851,159 398,156.089851 398,152.5 C398,149.078368 395.356198,146.27423 392,146.018945 L392,148.027464 C394.249941,148.27615 396,150.183701 396,152.5 C396,154.985281 393.985281,157 391.5,157 L391.5,157 Z M388,147 L392,150 L392,144 L388,147 L388,147 Z M388,147"
    );

  let icon = g1
    .append("svg")
    .attr("width", "14")
    .attr("height", "14")
    .attr("viewBox", "0 0 14 14")
    .append("g")
    .attr("fill", "#2196F3")
    .attr("fill-rule", "nonzero");
  icon
    .append("path")
    .attr(
      "d",
      "M12.316 9.677a5.677 5.677 0 0 0 0-8.019 5.676 5.676 0 0 0-8.019 0 5.56 5.56 0 0 0-.853 6.843s.094.158-.033.284L.518 11.678c-.575.576-.712 1.381-.202 1.892l.088.088c.51.51 1.316.373 1.892-.202l2.886-2.887c.133-.133.29-.04.29-.04a5.56 5.56 0 0 0 6.844-.852zM5.344 8.63a4.194 4.194 0 0 1 0-5.925 4.194 4.194 0 0 1 5.925 0 4.194 4.194 0 0 1 0 5.925 4.195 4.195 0 0 1-5.925 0z"
    );
  icon
    .append("path")
    .attr(
      "d",
      "M5.706 5.331a.584.584 0 0 1-.539-.813A3.688 3.688 0 0 1 9.996 2.56a.585.585 0 0 1-.457 1.078 2.516 2.516 0 0 0-3.294 1.336.585.585 0 0 1-.54.357z"
    );
  let g2 = g1
    .append("div")
    .datum({})
    .attr("class", "coco-bpm-slider-wrap");

  this.slider = g2
    .append("input")
    .datum({})
    .attr("type", "range")
    .attr("class", "coco-bpm-slider")
    .attr("id", "range")
    .attr("value", 1)
    .attr("min", 0.1)
    .attr("max", 2)
    .attr("step", 0.01)
    .on("input", () => {
      this.zoom.scaleTo(this.vis, d3.select("#range").property("value"));
      this.rangeWidth();
    });

  g2.append("div")
    .datum({})
    .attr("class", "coco-bpm-line-range")
    .attr("id", "lineZoomRange");

  document.getElementById("graph").addEventListener("mousemove", e => {
    let dummyX = e.offsetX;
    let dummyY = e.offsetY;

    if (this.startDrowLine && this.data[this.startDrowLine]) {
      this.removeAll();
      d3.selectAll("#drowLine").remove();
      let x, y;
      if (
        document.getElementById("wrap").getAttribute("transform") === null
      ) {
        x = e.offsetX;
        y = e.offsetY;
      } else {
        x = (e.offsetX - this.zoomTrans.x) / this.zoomTrans.k;
        y = (e.offsetY - this.zoomTrans.y) / this.zoomTrans.k;
      }

      var d = {
        source: {
          x: this.data[this.startDrowLine].x + 20,
          y: this.data[this.startDrowLine].y
        },
        target: {
          x: x,
          y: y
        }
      };
      var link = d3
        .linkHorizontal()
        .x(function (d) {
          return d.x;
        })
        .y(function (d) {
          return d.y;
        });

      this.conteiner
        .append("path")
        .attr("class", "path")
        .attr("id", "drowLine")
        .attr("d", link(d))
        .style("fill", "none")
        .style("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);

      this.conteiner
        .append("polyline")
        .attr(
          "points",
          d.source.x +
          "," +
          d.source.y +
          " " +
          (d.source.x + d.target.x) / 2 +
          "," +
          (d.source.y + d.target.y) / 2 +
          " " +
          d.target.x +
          "," +
          d.target.y
        )

        .style("fill", "none");

      this.drow();
    }
  });

  this.marker = this.conteiner
    .append("svg:defs")
    .append("svg:marker")
    .attr("id", "triangle")
    .attr("refX", 6)
    .attr("refY", 6)
    .attr("markerWidth", 30)
    .attr("markerHeight", 30)
    .attr("orient", "auto");
  this.marker
    .append("path")
    .attr("class", "path")
    .attr("d", "M 0 0 12 6 0 12 3 6")
    .style("fill", "#999");
  }

  
  drow() {
    this.drowLines();

    this.data.forEach((element, index, arr) => {
      let d, dx, dy, color;
      let count = 0;
      let countS = 0;
      
      let h = (65 + (count > 3 ? ((count - 3) * 27 + ( countS * 5) + (count * 5)) : 0+ ( countS * 5)));
      let selected = (this.selected !== null && (+this.selected === +index)) ? "stroke-width:1;stroke:rgb(0,0,0)" : "";
      let g = this.conteiner.append("g").attr("class", "g");
      switch (element.objectClass) {
        case "Data Model":
        case "Audit Rules":
        case "Contextual Rules":
        case "Role type x":
        // case "Board":
          dx = element.x - 10;
          dy = element.y - 8;
          color = this.colors[element.objectClass];
          count = 0;
          countS = 0;
          h = (65 + (count > 3 ? ((count - 3) * 27 + ( countS * 5) + (count * 5)) : 0+ ( countS * 5)));
          selected = (this.selected !== null && (+this.selected === +index)) ? "stroke-width:1;stroke:rgb(0,0,0)" : "";
          g = this.conteiner.append("g").attr("class", "g");
          g.append("rect")
            .attr("class", "nodes")
            .attr("id", index)
            .attr("style", selected)
            .attr("fill", color)
            .attr("x", element.x - 5)
            .attr("y", element.y - 10)
            .attr("width", 140)
            .attr("height", 35)
            .attr("rx", 10)
            .attr("ry", 10)
            .call(
              d3
                .drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            )
            .on("mouseover", (q, w, e) => {
              d3.event.stopPropagation();
              if (this.activeArrow) {
                document.documentElement.style.cursor = "default";
                d3.select(document.getElementById(e[0].id + "main")).style(
                  "fill",
                  "#84bd96"
                );
              }
            })
            .on("mouseout", (q, w, e) => {
              d3.event.stopPropagation();
              d3.select(document.getElementById(e[0].id + "main")).style(
                "fill",
                "#2196f3"
              );
              if (this.activeArrow) {
                document.documentElement.style.cursor = "not-allowed";
              }
            })
            .on("click", (d, i, s) => {
              d3.event.stopPropagation();
              this.selectedModal = s[0].id;
              this.selected = s[0].id;
              this.removeAll();
              this.drow();
              if (this.activeArrow)
                this.shepClick(s[0].id);
            })
            .on("dblclick", (d, i, s) => {
              this.selectedModal = s[0].id;
              let name = this.data[this.selectedModal].objectClass + (this.data[this.selectedModal].parameters.length + 1);
              this.showSide = true;
              this.selected = s[0].id;
              this.removeAll();
              this.drow();
              this.activeArrow = null;
              this.startDrowLine = null;
            });
          g.append("svg")
            .attr("x", element.x + 5)
            .attr("y", element.y - 5)
            .attr("width", 24)
            .attr("height", 24)
            .attr("viewBox", "0 0 24 24")
            .append("path")
            .attr("d", "M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z")
            // .text((element.name || element.id));
          // g.append("text")
          //   .attr("x", element.x - 5)
          //   .attr("y", element.y - 13)
          //   .text((element.name || element.id));

          g.append("text")
            .attr("id", index + "-remove")
            .attr("x", element.x + 140)
            .attr("y", element.y - 13)
            .text("X")
            .attr("cursor", "pointer")
            .on("click", (d, i, s) => {
              d3.event.stopPropagation();
              let id = s[0].id.split("-")[0];

             
              // const dialogRef = this.dialog.open(DialogCreateModelComponent, {
              //   width: '450px',
              //   data: {
              //     label: 'You delete the object! Are you sure?',
              //     deleteMode: true
              //   }
              // });
              // dialogRef.afterClosed().subscribe(model => {
              //   if (model) {
              //     this.saverComponent.push(JSON.parse(JSON.stringify( this.data )));
              //     let observableList = [];
              //     this.componentService.getAllByUserId(this.user._id).subscribe((data: any) => {
              //       this.formulaData = data;
              //       this.formulaData.forEach(comp => {
              //         comp.parameters.forEach(param => {
              //           if (param.value && param.value.charAt(0) === "=") {
              //             this.data[id].parameters.forEach(p => {
              //               let element = this.data[id].modelIdName + "." +
              //               this.data[id].id + "." + p.id;
              //               var re = new RegExp(element, 'g');
              //               param.value = param.value.replace(re, "0");
              //             });
              //           }
              //         });
              //         observableList.push(this.componentService.update(comp));
              //       });
  
              //       let obs = forkJoin(observableList);
              //       obs.subscribe(t => {
              //         this.componentService.delete(this.data[id]).subscribe((data) => {
              //           this.selectedModal = null;
              //           this.selected = null;
              //           this.getData();
              //         });
              //       });
              //     });
              //   }
              // });
            });

          // g.append("text")
          //   .attr("id", index + "-arrow")
          //   .attr("x", element.x + 135)
          //   .attr("y", element.y + 5)
          //   .text("=>")
          //   .attr("cursor", "pointer")
          //   .on("click", (d, i, s) => {
          //     d3.event.stopPropagation();
          //     let id = s[0].id.split("-")[0];
          //     this.shepClick(id);
          //   });

          // g.append("text")
          //   .attr("id", index + "-drag")
          //   .attr("x", element.x)
          //   .attr("y", element.y + 5)
          //   .text("|||")
          //   .attr("cursor", "pointer")
          //   .call(
          //     d3
          //       .drag()
          //       .on("start", dragstarted)
          //       .on("drag", dragged)
          //       .on("end", dragended)
          //   );

          break;

          case "AND":
          case "OR":
            dx = element.x - 10;
            dy = element.y - 8;
            color = this.colors[element.objectClass];
            count = 0;
            countS = 0;
            h = (65 + (count > 3 ? ((count - 3) * 27 + ( countS * 5) + (count * 5)) : 0+ ( countS * 5)));
            selected = (this.selected !== null && (+this.selected === +index)) ? "stroke-width:1;stroke:rgb(0,0,0)" : "";
            g = this.conteiner.append("g").attr("class", "g");
    
              g.append("rect")
                .attr("class", "nodes")
                .attr("id", index)
                .attr("style", selected)
                .attr("fill", color)
                .attr("x", element.x + 90)
                .attr("y", element.y - 10)
                .attr("width", 50)
                .attr("height", 50)
                .attr("rx", 15)
                .attr("ry", 15)
   
                .call(
                  d3
                    .drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended)
                )
                .on("mouseover", (q, w, e) => {
                  d3.event.stopPropagation();
                  if (this.activeArrow) {
                    document.documentElement.style.cursor = "default";
                    d3.select(document.getElementById(e[0].id + "main")).style(
                      "fill",
                      "#84bd96"
                    );
                  }
                })
                .on("mouseout", (q, w, e) => {
                  d3.event.stopPropagation();
                  d3.select(document.getElementById(e[0].id + "main")).style(
                    "fill",
                    "#2196f3"
                  );
                  if (this.activeArrow) {
                    document.documentElement.style.cursor = "not-allowed";
                  }
                })
                .on("click", (d, i, s) => {
                  d3.event.stopPropagation();
                  this.selectedModal = s[0].id;
                  this.selected = s[0].id;
                  this.removeAll();
                  this.drow();
                  if (this.activeArrow)
                    this.shepClick(s[0].id);
                })
                .on("dblclick", (d, i, s) => {
                  this.selectedModal = s[0].id;
                  let name = this.data[this.selectedModal].objectClass + (this.data[this.selectedModal].parameters.length + 1);
                  this.showSide = true;
                  this.selected = s[0].id;
                  this.removeAll();
                  this.drow();
                  this.activeArrow = null;
                  this.startDrowLine = null;
                });
    
              g.append("text")
                .attr("id", index + "-remove")
                .attr("x", element.x + 140)
                .attr("y", element.y - 13)
                .text("X")
                .attr("cursor", "pointer")
                .on("click", (d, i, s) => {
                  d3.event.stopPropagation();
                  let id = s[0].id.split("-")[0];
    
                });

          g.append("text")
            .attr("x", element.x+105 + (element.objectClass === "AND" ? -8 : 0))
            .attr("y", element.y + 20)
            .attr("fill", "white")
            .text(element.objectClass);
    
              break;
        default:
          break;
      }
      if (this.marker)
        this.marker
          .append("path")
          .attr("class", "path")
          .attr("d", "M 0 0 12 6 0 12 3 6")
          .style("fill", "#999");
      let self = this;

      function dragstarted(d) {
        // d3.select(this)
        //   .classed("active", true);
        self.start_x = +d3.event.x;
        self.start_y = +d3.event.y;
      }

      function dragged(d) {
        let current_scale, current_scale_string;
        let transform = document.getElementById('wrap')
        if (transform.getAttribute("transform") === null) {
          current_scale = 1;
        } else {
          current_scale_string = transform.getAttribute("transform").split(" ")[1];
          current_scale = +current_scale_string.substring(
            6,
            current_scale_string.length - 1
          );
        }

        if (!self.zoomTrans) {
          self.zoomTrans = {
            x: 0,
            y: 0,
            k: 1,
          };
        }

        self.dragSelected = this.getAttribute("id").split("-")[0];
        self.data[self.dragSelected].x =
          (d3.event.x - self.zoomTrans.x) / self.zoomTrans.k - 90;
        // self.start_x + (d3.event.x - self.start_x) / current_scale;
        // (e.offsetX - this.zoomTrans.x) / this.zoomTrans.k;
        let scale = 30;
        if (self.zoomTrans.k < 0.33) {
          scale = 50;
        }
        self.data[self.dragSelected].y = (
          (d3.event.y - self.zoomTrans.y) / self.zoomTrans.k - (scale / self.zoomTrans.k)) + 5;
        // self.start_y + (d3.event.y - self.start_y) / current_scale;
        self.removeAll();
        self.drow();


      }

      function dragended(d) {
        d3.select(this).classed("active", false);
        // self.txtQueryChanged.next({
        //   value: self.zoomTrans,
        //   selected: self.dragSelected,
        //   drag: 1
        // });
      }
    });
    
  }

  clickArrow;

  selectedLine;
  selectedLineId;
  selectedLineFrom;
  selectedLineTo;

  drowLines() {
    this.data.forEach((value, index, arr) => {
      value.selected.forEach(item => {
        let to = this.searchById(item, this.data, 'id');
        let from = this.data[index];
        if (to) {
          let x = +from.x;
          let y = +from.y;
          let x2 = +to.x;
          let y2 = +to.y;
          let minX = Math.abs(x - x2);
          let minY = Math.abs(y - y2);
          if (minX > minY) {
            if (+x < +x2) {
              x += 25;
              x2 -= 25;
            } else {
              x -= 25;
              x2 += 25;
            }
          } else {
            if (+y < +y2) {
              y += 25;
              y2 -= 25;
            } else {
              y -= 25;
              y2 += 25;
            }
          }

          var d = {
            source: {
              x: x + 110,
              y: y + 10
            },
            target: {
              x: x2 + 110,
              y: y2 + 10
            }
          };

          var link = d3
            .linkHorizontal()
            .x(function (d) {
              return d.x;
            })
            .y(function (d) {
              return d.y;
            });

          this.conteiner
            .append("path")
            .attr("d", link(d))
            .attr("id", from.id + to.id)
            .attr("class", "path")
            .style("fill", "none")
            .style("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .attr("marker-mid", "url(#triangle)");

          this.conteiner
            .append("path")
            .attr("class", "path")
            .attr("d", link(d))
            .style("fill", "none")
            .style("stroke", "#555")
            .attr("stroke-opacity", 0)
            .attr("stroke-width", 15)
            .on("click", () => {

              this.selected = undefined;

              this.removeAll();
              this.drow();
              // if (this.selectedLine) {
              //   this.unselectArrow();
              // }
              this.clickArrow = true;

              this.selectedLine = from.id + to.id;
              this.selectedLineId = index;
              this.selectedLineFrom = from;
              this.selectedLineTo = to;

              d3.select(document.getElementById(from.id + to.id)).style(
                "stroke-width",
                2.5
              );
              d3.select(document.getElementById(from.id + to.id)).style(
                "stroke",
                "black"
              );

            });

          this.conteiner
            .append("polyline")
            .attr(
              "points",
              d.source.x +
              "," +
              d.source.y +
              " " +
              (d.source.x + d.target.x) / 2 +
              "," +
              (d.source.y + d.target.y) / 2 +
              " " +
              d.target.x +
              "," +
              d.target.y
            )
            .style("fill", "none")
            .attr("marker-mid", "url(#triangle)");
        }

      });
    });
  }

  menuInit() {
    this.types.forEach(type => {
      if (document.getElementById(type)) {
        document.getElementById(type).addEventListener(
          "dragstart",
          ev => {
            ev.dataTransfer.setData('text', 'foo');
            this.dragType = type;
            if (this.isStart && type === "Start") {
              event.preventDefault();
            }
          },
          false
        );
      }
    });

    document.getElementById("AND").addEventListener(
      "dragstart",
      ev => {
        ev.dataTransfer.setData('text', 'foo');
        this.dragType = "AND";
      },
      false
    );

    document.getElementById("OR").addEventListener(
      "dragstart",
      ev => {
        ev.dataTransfer.setData('text', 'foo');
        this.dragType = "OR";
      
      },
      false
    );
    document.addEventListener("dragover", function (event) {
      event.preventDefault();
    });
    document.getElementById("graph").addEventListener(
      "drop",
      ev => {
        let x, y;
        if (
          document.getElementById("wrap").getAttribute("transform") === null
        ) {
          x = ev.offsetX;
          y = ev.offsetY;
        } else {
          x = (ev.offsetX - this.zoomTrans.x) / this.zoomTrans.k;
          y = (ev.offsetY - this.zoomTrans.y) / this.zoomTrans.k;
        }
        ev.preventDefault();
        console.log(this.data);
        
        let model = new ComponentClass();
        model.x = x - 100;
        model.y = y;
        model.objectClass = this.dragType;
        model.id = this.uuidv4();
        model.selected = [];
       
        this.data.push(model);
        
        console.log(this.data);

        this.drow();
      },
      false
    );
  }

  clear() {
    this.selected = null;
    this.activeArrow = null;
    // this.clickArrow = null;
    // this.selectedLine = null;
    // this.selectedLineId = null;
    // this.selectedLineFrom = null;
    // this.selectedLineTo = null;
    this.startDrowLine = null;
   
  }

  rangeWidth(flag?) {
    if (flag) {
      setTimeout(() => {
        document.getElementById("lineZoomRange").style.width = 50 + "%";
      }, 500);
    } else {
      let input = document.getElementById("range");
      let width;
      width = (input["value"] / 2) * 100;
      document.getElementById("lineZoomRange").style.width = width + "%";
    }
  }

  removeAll() {
    d3.selectAll("line").remove();
    d3.selectAll("polyline").remove();
    d3.selectAll("rect").remove();
    d3.selectAll("text").remove();
    d3.selectAll("circle").remove();

    // d3.selectAll("g").remove();

    d3.selectAll(".path").remove();
    d3.selectAll(".g").remove();
    // this.types.forEach(type => {
    //   d3.selectAll(type).remove();
    // });

  }

  shepClick(s) {
    this.selected = s;
    let id = this.selected;
    if (!this.startDrowLine) {
      this.activeArrow = id;
      this.startDrowLine = id;
    } else {
      let count = 0;
      console.log(this.data, id);
      
      this.data[id].selected.forEach((element, index) => {
        if (this.data[this.activeArrow].id === element) {
          count++;
        }
      });
      this.data[this.activeArrow].selected.forEach((element, index) => {
        if (this.data[id].id === element) {
          count++;
        }
      });
      if (count) {
        this.activeArrow = null;
        this.startDrowLine = null;
        this.removeAll();
        this.drowLines();
        this.drow();
        return;
      }

      if (id !== this.activeArrow) {
        this.data[this.activeArrow].selected.push(this.data[id].id);
        // this.txtQueryChanged.next({
        //   value: "query",
        //   selected: this.activeArrow
        // });
      }
      this.activeArrow = null;
      this.startDrowLine = null;
    }

    this.removeAll();
    this.drowLines();
    this.drow();
  }
  searchById(id, arr, idField?) {
    if (arr) {
      let f = idField || "_id";
      let result = arr.find(element => element[f] === id);
      return result;
    }
  }
  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  arrowSelect() {
    this.activeArrow = true;
  }
}
