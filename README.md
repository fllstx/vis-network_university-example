# vis-network_university-example

A vis-network example to show relations between schools, courses and degrees

## Requirements

### tl:dr

- I want a vis.js network map and a few buttons which change the structure of the network map.
- Clicking a button will filter the datasets and update the network map.
- When a node is selected I want to be able to hide/show a div for every child-node of the selection. I’ll do the css for the divs I’m talking about, so I’m just looking for the most efficient way of getting the list of the child-nodes each time a node is clicked.

### More info

> Below you'll see a few sample datasets.
> I want to be able to have a vis.js network map and 3 buttons, and when you click one it will change the DataView based on those datasets:
>
> Clicking Button 1: Parent nodes are Colleges > Schools > Degrees.
> Clicking Button 2: Parent nodes are relatedFunctions > Degrees > Courses
> Clicking Button 3: Parent nodes are Courses > Degrees they're found in
>
> The DataSets are examples only, so if there's a cleaner structure to minimise complexity for you, and updating by me, please advise.
> The DataSets will change and grow over time too so it needs to be scalable.

### Example Data

```js
let courseDataSet ={
  "course":[
      {
        "id":1,
        "label":"Economics 101",
        "title":"A beginners guide to Economics",
        "relatedFunctions":[
            {
              1:"mathematics",
              2:"logistics",
              3:"technology"
            }
        ],
        "schoolLocation":"Melbourne",
        "courseOwner":"School of Finance",
        "deliveryMode":"Face-to-face"
      },
      {
        "id":2,
        "label":"Advanced Marketing",
        "title":"Techniques and Tools to progress customer pipelines",
        "relatedFunctions":{
            1:"technology",
            2:"human resources",
            3:"psychology"
        },
        "schoolLocation":"Melbourne",
        "courseOwner":"School of Marketing",
        "deliveryMode":"Online"
      }
  ]
};

var degreeDataSet ={
  "degree":[
      {
        "id":1,
        "label":"Degree in Economics",
        "Title":"This prepares you for a job in finance",
        "relatedCourses":{
            1:"Economics 101",
            2:"Stockmarkets 101",
            3:"Advanced Algebra"
        },
        "degreeOwner":"School of Finance"
      }
  ]
};

var collegeDataSet ={
  "college":[
    {
      "id":1,
      "label":"College of Business",
      "Title":"The premier College for all things business",
      "relatedSchools":{
          1:"School of Finance",
          2:"School of Marketing",
          3:"School of Human Resourcing"
      }
    },
    {
      "id":2,
      "label":"College of Law",
      "Title":"Australia's best legal education",
      "relatedSchools":{
          1:"School of Law",
          2:"School of International Relations",
          3:"School of Human Rights and Ethics"
      }
    }
  ]
};
```
