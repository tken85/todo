$(document).ready(function(){
  toDo.init();

});

var toDo ={

  init : function(){
    toDo.initStyling();
    toDo.initEvents();

  },
  initStyling : function(){
    toDo.loadToDos(toDoList);
    toDo.setNumLeft();

  },
  initEvents : function(){
    //create new todo
    $('form').on('submit', function(event){
    event.preventDefault();
    var newToDo ={
      item: $("input[name='newtodo']").val(),
      status: "Active",
    };
    toDoList.push(newToDo);
    var toDoId = toDoList.indexOf(newToDo);
    newToDo.id = toDoId;
    toDo.loadTemplate($('.todo-section'), newToDo, $('#articleTmpl').html());
    $('input').val('');
    });
    $('#All').on('click', function(event){
      event.preventDefault();
      toDo.filterVisible("All");
      $(this).addClass('active_filter');
      $(this).siblings('li').removeClass('active_filter');
    });
    $('#Active').on('click', function(event){
      event.preventDefault();
      toDo.filterVisible("Active");
      $(this).addClass('active_filter');
      $(this).siblings('li').removeClass('active_filter');
    });
    $('#Complete').on('click', function(event){
      event.preventDefault();
      toDo.filterVisible("Completed");
      $(this).addClass('active_filter');
      $(this).siblings('li').removeClass('active_filter');
    });
    //toggle complete and active statuses
    $('.active-list').on('click','span', function(event){
      event.preventDefault();
      $(this).siblings('section').toggleClass('strikethrough');
      var index = $(this).closest('article').data('id');
      console.log(index);
      if(toDoList[index].status === "Active"){
        toDoList[index].status = "Completed";
        $(this).html('&#10003;');
      }
      else{
        toDoList[index].status = "Active";
        $(this).text("");
      }
      toDo.setNumLeft();
    });
    $('.active-list').on('click','.delete', function(event){
      event.preventDefault();
      var toDoId = $(this).closest('article').data('id');
      toDo.deleteToDo(toDoId, $(this));
      toDo.setNumLeft();
    });
    $('.active-list').on('click','#clear',function(event){
      event.preventDefault();
      toDo.clearComplete();
    });
  },
  loadTemplate : function($el, data, tmpl){
    var template = _.template(tmpl);
    var html = template(data);
    $el.append(html);
  },
  loadToDos : function(arr){
    _.each(arr, function(currVal, idx, arr){
      currVal.id = idx;
      if(currVal.status ==="Active"){
      toDo.loadTemplate($('.todo-section'), currVal, $('#articleTmpl').html());
    }
    else{
      toDo.loadTemplate($('.todo-section'), currVal, $('#articleTmpl2').html());
    }
    });
  },
  filterVisible : function(status){
    $('.todo-section').html("");
    var filtered = [];
    if(status ==="All"){
      filtered = toDoList;
    }
    else{
    filtered = toDoList.filter(function(item){
      return item.status === status;
    });
  }
    toDo.loadToDos(filtered);
  },
  deleteToDo : function(idx, $el){
    toDoList.splice(idx,1);
    $('.todo-section').html('');
    toDo.loadToDos(toDoList);
  },
  clearComplete : function(){
    $('.todo-section').html("");
    var filtered =[];
    toDoList = toDoList.filter(function(item){
      return item.status === "Active";
    });
    toDo.loadToDos(toDoList);
  },
  setNumLeft: function(){
    $('#num-left').html("");
    var numLeft = toDoList.filter(function(item){
      return item.status === "Active";
    }).length;
    if(numLeft === 1){
      $('#num-left').html(numLeft + " item left");
    }
    else{
      $('#num-left').html(numLeft + " items left");
    }
  }

};
