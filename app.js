let network, collages, schools, courses, degrees, functions;

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

async function getCollages() {
	return fetch('./data/collages.json').then(response => response.json());
}

async function getCourses() {
	return fetch('./data/courses.json').then(response => response.json());
}

async function getDegrees() {
	return fetch('./data/degrees.json').then(response => response.json());
}

async function getSchools() {
	return fetch('./data/schools.json').then(response => response.json());
}

async function getFunctions() {
	return fetch('./data/functions.json').then(response => response.json());
}

function enableButtons() {
	Array.from(document.getElementsByClassName('filterBtn')).forEach(el => {
		el.removeAttribute('disabled');
	});
}

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
 * button handler "colleges > schools > degrees"
 */
function btn1() {
	const data = collageToDegreeData();
	network.setData(data);
}

/**
 * button handler "functions > courses > degrees"
 */
function btn2() {
	const data = functionsToDegreesData();
	network.setData(data);
}

/**
 * button handler "courses > degrees"
 */
function btn3() {
	const data = coursesToDegreesData();
	network.setData(data);
}

/**
 * Load data and initialize the network.
 */
async function init() {
	collages = await getCollages();
	schools = await getSchools();
	courses = await getCourses();
	degrees = await getDegrees();
	functions = await getFunctions();
	await document.fonts.load('normal normal 400 24px/1 "FontAwesome"');
	enableButtons();

	var container = document.getElementById("network");

	/* show "colleges > schools > degrees" by default */
	const data = collageToDegreeData();

	var options = {
		groups: GROUPS,
		
		/* disable this if you don't want a hierarchical view */
		layout: {
			hierarchical: {
				direction: 'UD'
			}
		}
	};

	network = new vis.Network(container, data, options);
}