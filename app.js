let network, collages, schools, courses, degrees, functions, allEntries;

const NODE_COLOR = '#9b4dca';
const NODE_ICON_SIZE = 40;
const EDGE_COLOR = '#4B0082';

const DEFAULT_EDGE_SETTINGS = {
	color: EDGE_COLOR,
	arrows: {
		to: {
			enabled: true
		}
	}
}

/**
 * A vis-network group config.
 * This is only needed if the different node-types should look differently.
 */
const GROUPS = {
	collage: {
		shape: "icon",
		icon: {
			face: "'FontAwesome'",
			code: "\uf0f7",
			size: NODE_ICON_SIZE,
			color: NODE_COLOR,
		}
	},
	school: {
		shape: "icon",
		icon: {
			face: "'FontAwesome'",
			code: "\uf1ad",
			size: NODE_ICON_SIZE,
			color: NODE_COLOR,
		}
	},
	course: {
		shape: "icon",
		icon: {
			face: "'FontAwesome'",
			code: "\uf0c0",
			size: NODE_ICON_SIZE,
			color: NODE_COLOR,
		}
	},
	degree: {
		shape: "icon",
		icon: {
			face: "'FontAwesome'",
			code: "\uf19d",
			size: NODE_ICON_SIZE,
			color: NODE_COLOR,
		}
	},
	tag: {
		shape: "icon",
		icon: {
			face: "'FontAwesome'",
			code: "\uf02d",
			size: NODE_ICON_SIZE,
			color: NODE_COLOR,
		}
	}
};

/**
 * Load all collages from "databse"
 */
async function getCollages() {
	return fetch('./data/collages.json').then(response => response.json());
}

/**
 * Load all courses from "databse"
 */
async function getCourses() {
	return fetch('./data/courses.json').then(response => response.json());
}

/**
 * Load all degrees from "databse"
 */
async function getDegrees() {
	return fetch('./data/degrees.json').then(response => response.json());
}

/**
 * Load all schools from "databse"
 */
async function getSchools() {
	return fetch('./data/schools.json').then(response => response.json());
}

/**
 * Load all "function" from "databse"
 */
async function getFunctions() {
	return fetch('./data/functions.json').then(response => response.json());
}

/**
 * Buttons are disbaled by default.
 * After everything needed is loaded they can be enabled.
 */
function enableButtons() {
	Array.from(document.getElementsByClassName('filterBtn')).forEach(el => {
		el.removeAttribute('disabled');
	});
}

/**
 * Get all edges form all collages to its degrees.
 */
function collageToDegreeData() {
	const collageNodes = collages.map(collage => {
		return {
			id: collage.id,
			label: collage.label,
			group: 'collage',
			level: 0
		}
	});

	const schoolNodes = schools.map(school => {
		return {
			id: school.id,
			label: school.label,
			group: 'school',
			level: 1
		}
	});

	const degreeNodes = degrees.map(degree => {
		return {
			id: degree.id,
			label: degree.label,
			group: 'degree',
			level: 2
		}
	});

	const nodes = new vis.DataSet([
		...collageNodes,
		...schoolNodes,
		...degreeNodes
	]);

	const collageToSchool = [];
	for (const collage of collages) {
		const collageId = collage.id;
		const collageSchools = collage.schools || [];
		collageSchools.forEach(schoolId => {
			collageToSchool.push({
				from: collageId,
				to: schoolId,
				...DEFAULT_EDGE_SETTINGS
			});
		});
	}

	const schoolToDegree = [];
	for (const school of schools) {
		const schoolId = school.id;
		const schoolDegrees = school.degrees || [];
		schoolDegrees.forEach(degreeId => {
			schoolToDegree.push({
				from: schoolId,
				to: degreeId,
				...DEFAULT_EDGE_SETTINGS
			});
		});
	}

	const edges = new vis.DataSet([
		...collageToSchool,
		...schoolToDegree
	]);

	return {
		nodes,
		edges
	}
}

/**
 * Get all edges form all functions to its degrees.
 */
function functionsToDegreesData() {
	const usedFunctions = new Set();
	courses.forEach(course => {
		const courseFunctions = course.functions;
		courseFunctions.forEach(tag => {
			usedFunctions.add(tag);
		});
	});

	const functionNodes = [];
	functions.forEach(func => {
		if (usedFunctions.has(func.id)) {
			functionNodes.push({
				id: func.id,
				label: func.label,
				level: 0,
				group: 'tag'
			});
		}
	});

	const courseNodes = courses.map(course => {
		return {
			id: course.id,
			label: course.label,
			level: 1,
			group: 'course'
		}
	});

	const degreeNodes = degrees.map(degree => {
		return {
			id: degree.id,
			label: degree.label,
			level: 2,
			group: 'degree'
		}
	});

	const nodes = new vis.DataSet([
		...functionNodes,
		...courseNodes,
		...degreeNodes,
	]);

	const tagToCourse = [];
	for (const course of courses) {
		const courseTags = course.functions || [];
		courseTags.forEach(tagId => {
			tagToCourse.push({
				from: tagId,
				to: course.id,
				...DEFAULT_EDGE_SETTINGS
			});
		});
	}

	const coursesToDegrees = [];
	for (const degree of degrees) {
		const degreeId = degree.id;
		const degreeCourses = degree.courses || [];
		degreeCourses.forEach(courseId => {
			coursesToDegrees.push({
				from: courseId,
				to: degreeId,
				...DEFAULT_EDGE_SETTINGS
			});
		});
	}

	const edges = new vis.DataSet([
		...tagToCourse,
		...coursesToDegrees
	]);

	return {
		nodes,
		edges
	}
}

/**
 * Get all edges form all courses to its degrees.
 */
function coursesToDegreesData() {
	const courseNodes = courses.map(course => {
		return {
			id: course.id,
			label: course.label,
			level: 0,
			group: 'course'
		}
	});

	const degreeNodes = degrees.map(degree => {
		return {
			id: degree.id,
			label: degree.label,
			level: 1,
			group: 'degree'
		}
	});

	const nodes = new vis.DataSet([
		...courseNodes,
		...degreeNodes,
	]);

	const coursesToDegrees = [];
	for (const degree of degrees) {
		const degreeId = degree.id;
		const degreeCourses = degree.courses || [];
		degreeCourses.forEach(courseId => {
			coursesToDegrees.push({
				from: courseId,
				to: degreeId,
				...DEFAULT_EDGE_SETTINGS
			});
		});
	}

	const edges = new vis.DataSet([
		...coursesToDegrees
	]);

	return {
		nodes,
		edges
	}
}

/**
 * Find the data-entry with the given id
 */
function getSelectedInfos(id) {

	return allEntries.find(entry => entry.id === id);
}

/**
 * Get all child ids and return the data-entries of them
 */
function getChildInfos(id) {
	const childIds = network.getConnectedNodes(id, 'to');
	return allEntries.filter(entry => childIds.includes(entry.id));
}

/**
 * Show infos about the selected node
 */
function showSelectedInfo(info) {
	const $container = document.getElementById('selected');
	
	/* clean container */
	$container.innerHTML = '';
	if (!info) return;

	$infoBlock = document.createElement('div');
	$infoBlock.innerHTML = [
		`<h2>${info.label}</h2>`,
		info.location ?  `<div>${info.location}</div>` : null,
		info.description ? `<div>${info.description}</div>` : null,
		`<hr />`
	].filter(Boolean).join('\n');
	$container.appendChild($infoBlock);
}

/*
 * Show information of the provided child-entries
 */
function showChildInfo(children) {
	const $container = document.getElementById('children');
	
	/* Clean container */
	$container.innerHTML = '';
	if (!children) return;

	/* For each entry create a new DOM-element */
	children.forEach(child => {
		const $childInfo = document.createElement('li');
		$childInfo.classList.add('childInfo');
		$childInfo.innerHTML = [
			`<b>${child.label}</b>`,
			child.location ?  `<div>${child.location}</div>` : null,
			child.description ? `<div>${ child.description}</div>` : null,
		].join('\n');
		$container.appendChild($childInfo)
	});
}

/**
 * Button handler "colleges > schools > degrees"
 */
function btn1() {
	const data = collageToDegreeData();
	network.setData(data);
}

/**
 * Button handler "functions > courses > degrees"
 */
function btn2() {
	const data = functionsToDegreesData();
	network.setData(data);
}

/**
 * Button handler "courses > degrees"
 */
function btn3() {
	const data = coursesToDegreesData();
	network.setData(data);
}

/**
 * Handler for node-select
 */
function onclick(clickEventData) {
	/* get selected node */
	const selectedNodeId = clickEventData.nodes[0];

	if (selectedNodeId) {
		const selectedEntry = getSelectedInfos(selectedNodeId);
		showSelectedInfo(selectedEntry);
		const childEntries = getChildInfos(selectedNodeId);
		showChildInfo(childEntries);
	} else {
		showSelectedInfo(null);
		showChildInfo(null);
	}
}

/**
 * Load data and initialize the network.
 */
async function init() {
	/* Load data from server and store them globaly */
	collages = await getCollages();
	schools = await getSchools();
	courses = await getCourses();
	degrees = await getDegrees();
	functions = await getFunctions();

	/* Create one array with all entries for easy lookup */
	allEntries = Object.freeze([
		...collages,
		...schools,
		...courses,
		...degrees
	]);

	/* Ensure teh uses fontawesome is loaded */
	await document.fonts.load('normal normal 400 24px/1 "FontAwesome"');
	

	var container = document.getElementById("network");

	/* Show "colleges > schools > degrees" by default.
	 * Could also be {} for an empty network by default. */
	const data = collageToDegreeData();

	var options = {
		groups: GROUPS,
		
		/* Show the network as a hierarchical tree */
		layout: {
			hierarchical: {
				direction: 'UD'
			}
		}
	};

	network = new vis.Network(container, data, options);

	/* Add network click handler */
	network.on('click', onclick);

	/* After everything is loaded enable the buttons*/
	enableButtons();
}