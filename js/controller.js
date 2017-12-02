function Controller(element) {
	this.renderer = new Renderer(element);
	this.addListeners(element);
	this.buildSystem();
}

Controller.prototype = {
	buildRuleField(index) {
		var node = document.createElement("tr");
		node.innerHTML = "<td>Rule " + index + ":</td><td><input id=\"l3d-rule" + index + "\" type=\"text\" onchange=\"controller.buildSystem()\"/></td>";
		
		return node;
	},
	
	addRuleField() {
		var index = 0;
		while(this.getRule(++index) != null);
		
		var lastRule = document.getElementById("l3d-rule" + (index - 1));
		lastRule.parentNode.parentNode.parentNode.insertBefore(this.buildRuleField(index), document.getElementById("add-rule-button"));
		document.getElementById("result-column").rowSpan = document.getElementById("result-column").rowSpan + 1;
	},
	
	addListeners(element) {
		this.rendererRect = element.getBoundingClientRect();
		
		element.addEventListener("mousedown", this.mouseDown.bind(this));
		element.addEventListener("mousemove", this.mouseMove.bind(this));
		element.addEventListener("mouseup", this.mouseUp.bind(this));
		element.addEventListener("mouseleave", this.mouseUp.bind(this));
		element.addEventListener("mousewheel", this.mouseScroll.bind(this));
	},
	
	mouseScroll(event) {
		if(event.wheelDelta > 0)
			this.renderer.zoomIn();
		else
			this.renderer.zoomOut();
	},
	
	mouseDown(event) {
		this.dragStart(event.x - this.rendererRect.x, event.y - this.rendererRect.y)
	},
	
	mouseMove(event) {
		this.drag(event.x - this.rendererRect.x, event.y - this.rendererRect.y)
	},
	
	mouseUp(event) {
		this.dragStop();
	},
	
	dragStart(x, y) {
		this.dragging = true;
		this.dragX = x;
		this.dragY = y;
	},
	
	drag(x, y) {
		if(this.dragging) {
			var deltaX = x - this.dragX;
			var deltaY = y - this.dragY;
			
			this.dragX = x;
			this.dragY = y;
			
			this.renderer.moveView(deltaX, deltaY);
		}
	},
	
	dragStop() {
		this.dragging = false;
	},
	
	getResult() {
		return document.getElementById("l3d-result");
	},
	
	getAxiom() {
		return document.getElementById("l3d-axiom");
	},
	
	getConstants() {
		return document.getElementById("l3d-constants");
	},
	
	getRule(index) {
		return document.getElementById("l3d-rule" + index);
	},
	
	getAngle() {
		return document.getElementById("l3d-angle");
	},
	
	getRenderStyle() {
		return document.getElementById("l3d-render-style");
	},
	
	buildSystem() {
		this.system = new Lindenmayer();
		
		this.addRules(this.system);
	},
	
	addRules(system) {
		var rule;
		var index = 1;
		
		while(rule = this.getRule(index++), rule != null)
			if(rule.value != "")
				system.addRule(rule.value);
	},
	
	clearResult() {
		this.getResult().value = "";
		
		this.renderer.createScene([], this.getConstants().value, this.getAngle().value, this.getRenderStyle().value);
	},
	
	setResult(result) {
		this.getResult().value = Lindenmayer.prototype.toString(result);
		
		this.renderer.createScene(result, this.getConstants().value, this.getAngle().value, this.getRenderStyle().value);
	},
	
	step() {
		if(this.getResult().value == "")
			this.setResult(this.system.process(this.getAxiom().value, 1));
		else
			this.setResult(this.system.process(this.getResult().value, 1));
	}
}