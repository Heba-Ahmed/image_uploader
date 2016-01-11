
$(document).ready(function() {
	
	console.log('DOCUMENT READY') ;
	
	$tree.tree({
		data: data,
		saveState: true,
		dragAndDrop: true,
		autoEscape: false,
		onCreateLi: function(node, $li) {
			// Append a link to the jqtree-element div.
			if(node.type=='check'){
				var appended_buttons = '<span class="node_tooltip" id="node_'+node.id+'" style="display:none;float:right">'+
			    '&nbsp;<a href="#" class="edit_node" id="edit_node_'+node.id+'" onclick="trigger_edit_node(event)"><i class="fa fa-pencil-square-o"></i></a>&nbsp;'+
			    '<a href="#" class="remove_node" id="remove_node_'+node.id+'" onclick="remove_node()"><i class="fa fa-times"></i></a>&nbsp;'+
				'<a href="#" class="add_sibling" id="add_sibling_'+node.id+'" onclick="add_sibling(event)"><i class="fa fa-chevron-right"></i></a>&nbsp;'+
				'<a href="#" class="add_child" id="add_child_'+node.id+'" onclick="add_child(event)"><i class="fa fa-chevron-down"></i></a>&nbsp;'+
				'</span>' ;
			}
			else{
				var appended_buttons = '<span class="node_tooltip" id="node_'+node.id+'" style="display:none;float:right">'+
			    '<a href="#" class="remove_node" id="remove_node_'+node.id+'" onclick="remove_node()"><i class="fa fa-times"></i></a>&nbsp;'+
				'<a href="#" class="add_sibling" id="add_sibling_'+node.id+'" onclick="add_sibling(event)"><i class="fa fa-chevron-right"></i></a>&nbsp;'+
				'<a href="#" class="add_child" id="add_child_'+node.id+'" onclick="add_child(event)"><i class="fa fa-chevron-down"></i></a>&nbsp;'+
				'</span>' ;
			}
			$li.find('.jqtree-element').append(appended_buttons);
		}
	});
	
	$tree.bind(
	    'tree.select',
	    function(event){
	        if (event.node) {
	            var node = event.node;
	            $(".node_tooltip").hide() ;
		        $("#node_"+node.id).show() ;
	        }
	        else {
	            $(".node_tooltip").hide() ;
	        }
	    }
	);
	
}) ;

$tree.bind(
    'tree.init',
    function() {	
        var node = $tree.tree('getSelectedNode');
        if(node){
	        $("#node_"+node.id).show() ;
		}
    }
);

function showSlected(){
	var node = $tree.tree('getSelectedNode');
	console.log(node) ;
}

function showJSON(){
	$("#JSON").html($tree.tree('toJson')) ;
}

// remaining time condition
function applyRemainingTime(){
	var remaining_lower = $("#remaining_lower").val() ;
	var remaining_upper = $("#remaining_upper").val() ;
	var label, operator, reference, ok ;
	if(remaining_lower!='' && remaining_upper!=''){
		label = remaining_lower+' < Remaining Time < '+remaining_upper ;
		operator = 'range' ;
		reference = [remaining_lower,remaining_upper] ;
		ok = true ;
	}
	else if(remaining_lower!='' && remaining_upper==''){
		label = 'Remaining Time > '+remaining_lower ;
		operator = '>' ;
		reference = remaining_lower ;
		ok = true ;
	}
	else if(remaining_lower=='' && remaining_upper!=''){
		label = 'Remaining Time < '+remaining_upper ;
		operator = '<' ;
		reference = remaining_upper ;
		ok = true ;
	}
	else{
		ok = false ;
		alert('You must at least provide a lower or upper threshold') ;
	}
	if(ok) updateNode({name: label, type: 'check', key: 'remain_time', operator: operator, reference: reference}) ;
}

// idle time condition
function applyIdleTime(){
	var idle_lower = $("#idle_lower").val() ;
	var idle_upper = $("#idle_upper").val() ;
	var label, operator, reference, ok ;
	if(idle_lower!='' && idle_upper!=''){
		label = idle_lower+' < Idle Time < '+idle_upper ;
		operator = 'range' ;
		reference = [idle_lower,idle_upper] ;
		ok = true ;
	}
	else if(idle_lower!='' && idle_upper==''){
		label = 'Idle Time > '+idle_lower ;
		operator = '>' ;
		reference = idle_lower ;
		ok = true ;
	}
	else if(idle_lower=='' && idle_upper!=''){
		label = 'Idle Time < '+idle_upper ;
		operator = '<' ;
		reference = idle_upper ;
		ok = true ;
	}
	else{
		ok = false ;
		alert('You must at least provide a lower or upper threshold') ;
	}
	if(ok) updateNode({name: label, type: 'check', key: 'idle_time', operator: operator, reference: reference}) ;
}

// validity condition
function applyValidity(){
	var validity_lower = $("#validity_lower").val() ;
	var validity_upper = $("#validity_upper").val() ;
	var label, operator, reference, ok ;
	if(validity_lower!='' && validity_upper!=''){
		label = validity_lower+' < Validity < '+validity_upper ;
		operator = 'range' ;
		reference = [validity_lower,validity_upper] ;
		ok = true ;
	}
	else if(validity_lower!='' && validity_upper==''){
		label = 'Validity > '+validity_lower ;
		operator = '>' ;
		reference = validity_lower ;
		ok = true ;
	}
	else if(validity_lower=='' && validity_upper!=''){
		label = 'Validity Time < '+validity_upper ;
		operator = '<' ;
		reference = validity_upper ;
		ok = true ;
	}
	else{
		ok = false ;
		alert('You must at least provide a lower or upper threshold') ;
	}
	if(ok) updateNode({name: label, type: 'check', key: 'validity', operator: operator, reference: reference}) ;
}

// never charged condition
function applyNeverCharged(flag){
	var label, operator, reference ;
	if(flag){
		label = 'Never charged = true' ;
		operator = '=' ;
		reference = 'true' ;
	}
	else{
		label = 'Never charged = false' ;
		operator = '=' ;
		reference = 'false' ;
	}
	updateNode({name: label, type: 'check', key: 'never_charged', operator: operator, reference: reference}) ;
}

// time condition
function applyTime(){
	var time_lower = $("#time_lower").val() ;
	var time_upper = $("#time_upper").val() ;
	var label, operator, reference, ok ;
	if(time_lower!='' && time_upper!=''){
		label = time_lower+' < Time < '+time_upper ;
		operator = 'range' ;
		reference = [time_lower,time_upper] ;
		ok = true ;
	}
	else{
		ok = false ;
		alert('You must at least provide a lower or upper threshold') ;
	}
	if(ok) updateNode({name: label, type: 'check', key: 'time', operator: operator, reference: reference}) ;
}

 
function applyUsedBefore(){
	var used_action_label = $("#used_action option:selected").text();
	var used_action_id = $("#used_action option:selected").val();
	var was_or_not_label = $("#was_or_not option:selected").text();
	var was_or_not = $("#was_or_not option:selected").val();
	
	var check_name = used_action_label + ' ' + was_or_not_label+' used today';
	updateNode({name: check_name , type: 'check', key: 'action_used_or_not', operator: was_or_not, reference: used_action_id}) ;
}

////////////////////////////////////////////////////////////// ACTIONS ///////////////////////////////////////////////

function applyAction(verb,attr){
	if(verb=='charge_action'){
		updateNode({name: attr.label, type: 'action', verb: verb, action_id: attr.action_id}) ;
	}
	else if(verb=='disable_channel'){
		updateNode({name: 'Disable Channel', type: 'action', verb: verb}) ;
	}
	else if(verb=='enable_channel'){
		updateNode({name: 'Enable Channel', type: 'action', verb: verb}) ;
	}
	else if(verb=='reset_remaining_minutes'){
		updateNode({name: 'Reset Remaining Minutes to Zero', type: 'action', verb: verb}) ;
	}
	else if(verb=='exit_automation'){
		updateNode({name: 'Exit Scenario', type: 'action', verb: verb}) ;
	}
}
///////////////////////////////////////////////////////////// JqTree API ////////////////////////////////////////////

// update node value (label & JSON)
function updateNode(object){
	var node = $tree.tree('getSelectedNode');
	if(node.type && node.type!=object.type){ return alert("You can not add "+object.type+ "s to "+node.type+" nodes") ;}
	if(object.type=='check'){
		if(!node.conditions) {
			node['conditions'] = [] ;
			node.labels = [] ;
			node.operator = 'OR' ;
		}
		node.labels.push(object.name) ;
		var brackets_names = node.labels.map(function(label){ return '['+label+']' ;}) ;
		var joined_name = '<i class="fa fa-question"></i> '+brackets_names.join(' '+node.operator+' ') ;
		var newObj = {name: joined_name, type: 'check', conditions: node.conditions} ;
		newObj.conditions.push( {key: object.key, operator: object.operator, reference: object.reference} ) ;
		object = newObj ;
	}
	else if(object.type=='action'){
		object.name = '<i class="fa fa-bolt"></i> '+object.name ;
	}
	$tree.tree(
	    'updateNode',
	    node,
	    object
	);
	evaluate_checks_to_remove() ;
	$("#node_"+node.id).show() ;
}

// removes a check from a node
function remove_check_from_node(index){
	var node = $tree.tree('getSelectedNode');
	if(node.type=='check'){
		newObj = {conditions: node.conditions, labels: node.labels, operator: node.operator} ;
		newObj.conditions.splice(index,1) ;
		newObj.labels.splice(index,1) ;
		var brackets_names = newObj.labels.map(function(label){ return '['+label+']' ;}) ;
		var joined_name = '<i class="fa fa-question"></i> '+brackets_names.join(' '+newObj.operator+' ') ;
		newObj.name = joined_name ;
		$tree.tree(
		    'updateNode',
		    node,
		    newObj
		);
		$("#node_"+node.id).show() ;
		evaluate_checks_to_remove() ;
	}
}

// check typed node edit trigger
function evaluate_checks_to_remove(){
	var node = $tree.tree('getSelectedNode');
	if(node.labels){
		var divString = '' ;
		divString += '<p align="center">' ;
		divString += '<button id="and_button" type="button" class="btn btn-primary" onclick="set_multi_check_operator(\'AND\')">AND</button>' ;
		divString += '&nbsp;' ;
		divString += '<button id="or_button" type="button" class="btn btn-primary" onclick="set_multi_check_operator(\'OR\')">OR</button>' ;
		divString += '</p>' ;
		$.each(node.labels, function(index,label){
			divString += '<div class="alert alert-info" style="display:inline-block">' ;
			divString += '<span id="check_remover_'+index+'">'+label+'</span>&nbsp;&nbsp;' ;
			divString += '<a class="btn btn-danger" href="#" onclick="remove_check_from_node('+index+')"><i class="fa fa-trash-o fa-lg"></i> Delete</a>' ;
			divString += '</div><br>' ;
		}) ;
		divString += '<a class="btn btn-danger" href="#" onclick="close_overlay()"><i class="fa fa-times fa-lg"></i> Close</a>' ;
		$("#checks_overlay").html(divString) ;
		if(node.operator=='AND') { $("#and_button").removeClass("btn-outline") ; $("#or_button").addClass("btn-outline") ;}
		else if(node.operator=='OR') { $("#and_button").addClass("btn-outline") ; $("#or_button").removeClass("btn-outline") ;}
	}
	else{
		console.log('nothing to edit') ;
	}
} ;

function trigger_edit_node(event){
	event.stopPropagation() ;
	evaluate_checks_to_remove() ;
	$('#checks_overlay').popup('show');
}

function set_multi_check_operator(operator){
	var node = $tree.tree('getSelectedNode');
	if(node.operator){
		var brackets_names = node.labels.map(function(label){ return '['+label+']' ;}) ;
		var joined_name = '<i class="fa fa-question"></i> '+brackets_names.join(' '+operator+' ') ;
		$tree.tree(
		    'updateNode',
		    node,
		    {name: joined_name, operator: operator}
		);
		evaluate_checks_to_remove() ;
	}
	$("#node_"+node.id).show() ;
}

function close_overlay(){
	$('#checks_overlay').popup('hide');
}
	
// add sibling node
function add_sibling(event){
	event.stopPropagation() ;
	var sibling_node = $tree.tree('getSelectedNode');
	cumulative_id = cumulative_id + 1 ;
	$tree.tree(
		'addNodeAfter',{
        label: 'new_sibling',
        id: cumulative_id
    },
    sibling_node);
    $("#node_"+sibling_node.id).show() ;
} ;

// add child node
function add_child(event){
	event.stopPropagation() ;
	var parent_node = $tree.tree('getSelectedNode');
	cumulative_id = cumulative_id + 1 ;
	$tree.tree(
		'appendNode', {
		label: 'new_child',
		id: cumulative_id
	},
	parent_node) ;
	$tree.tree('openNode', parent_node) ;
	$("#node_"+parent_node.id).show() ;
} ;

// remove node
function remove_node(){
	var node = $tree.tree('getSelectedNode');
	$tree.tree('removeNode', node);
} ;
