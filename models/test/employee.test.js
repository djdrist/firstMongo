const Employee = require('../employee.model.js');
const expect = require('chai').expect;

describe('Employee', () => {
	it('should throw an error if no "firstName" arg', () => {
		const dep = new Employee({ lastName: 'Doe', department: 'IT' });

		dep.validate((err) => {
			expect(err.errors.firstName).to.exist;
		});
	});
	it('should throw an error if no "lastName" arg', () => {
		const dep = new Employee({ firtName: 'Jane', department: 'IT' });

		dep.validate((err) => {
			expect(err.errors.lastName).to.exist;
		});
	});
	it('should throw an error if no "department" arg', () => {
		const dep = new Employee({ firstName: 'Jane', lastName: 'Doe' });

		dep.validate((err) => {
			expect(err.errors.department).to.exist;
		});
	});

	it('should throw an error if "firstName" is not a string', () => {
		const cases = [{}, []];
		for (let firstName of cases) {
			const dep = new Employee({ firstName, lastName: 'Doe', department: 'IT' });

			dep.validate((err) => {
				expect(err.errors.firstName).to.exist;
			});
		}
	});
	it('should throw an error if "lastName" is not a string', () => {
		const cases = [{}, []];
		for (let lastName of cases) {
			const dep = new Employee({ lastName, firtName: 'Jane', department: 'IT' });

			dep.validate((err) => {
				expect(err.errors.lastName).to.exist;
			});
		}
	});
	it('should throw an error if "department" is not a string', () => {
		const cases = [{}, []];
		for (let department of cases) {
			const dep = new Employee({ firstName: 'Jane', lastName: 'Doe', department });

			dep.validate((err) => {
				expect(err.errors.department).to.exist;
			});
		}
	});

	it('should not throw an error if all data is okay', () => {
		const dep = new Employee({ firstName: 'Jane', lastName: 'Doe', department: 'IT' });

		dep.validate((err) => {
			expect(err).to.not.exist;
		});
	});
});
