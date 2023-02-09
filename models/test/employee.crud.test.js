const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
	before(async () => {
		try {
			await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
		} catch (err) {
			console.error(err);
		}
	});
	describe('Reading data', () => {
		before(async () => {
			const testEmpOne = new Employee({ firstName: 'Jane', lastName: 'Doe', department: 'IT' });
			await testEmpOne.save();

			const testEmpTwo = new Employee({ firstName: 'Jack', lastName: 'Doe', department: 'MARKETING' });
			await testEmpTwo.save();
		});

		it('should return all the data with "find" method', async () => {
			const employees = await Employee.find();
			const expectedLength = 2;
			expect(employees.length).to.be.equal(expectedLength);
		});

		it('should return a proper document by firstName arg with "findOne" method', async () => {
			const employee = await Employee.findOne({ firstName: 'Jane' });
			expect(employee.firstName).to.be.equal('Jane');
		});
		it('should return a proper document by lastName arg with "findOne" method', async () => {
			const employee = await Employee.findOne({ lastName: 'Doe' });
			expect(employee.lastName).to.be.equal('Doe');
		});
		it('should return a proper document by departmet arg with "findOne" method', async () => {
			const employee = await Employee.findOne({ department: 'IT' });
			expect(employee.department).to.be.equal('IT');
		});

		after(async () => {
			await Employee.deleteMany();
		});
	});
	describe('Creating data', () => {
		it('should insert new document with "insertOne" method', async () => {
			const employee = new Employee({ firstName: 'Jane', lastName: 'Doe', department: 'IT' });
			await employee.save();
			expect(employee.isNew).to.be.false;
		});

		after(async () => {
			await Employee.deleteMany();
		});
	});
	describe('Updating data', () => {
		beforeEach(async () => {
			const testEmpOne = new Employee({ firstName: 'Jane', lastName: 'Doe', department: 'IT' });
			await testEmpOne.save();

			const testEmpTwo = new Employee({ firstName: 'Jack', lastName: 'Doe', department: 'MARKETING' });
			await testEmpTwo.save();
		});

		it('should properly update one document with "updateOne" method', async () => {
			await Employee.updateOne({ firstName: 'Jane', lastName: 'Doe', department: 'IT' }, { $set: { firstName: '=Employee #1=' } });
			const updatedEmployee = await Employee.findOne({ firstName: '=Employee #1=' });
			expect(updatedEmployee).to.not.be.null;
		});

		it('should properly update one document with "save" method', async () => {
			const employee = await Employee.findOne({ firstName: 'Jane', lastName: 'Doe', department: 'IT' });
			employee.firstName = '=Employee #1=';
			await employee.save();

			const updatedEmployee = await Employee.findOne({ firstName: '=Employee #1=' });
			expect(updatedEmployee).to.not.be.null;
		});

		it('should properly update multiple documents with "updateMany" method', async () => {
			await Employee.updateMany({}, { $set: { firstName: 'Updated!' } });
			const employees = await Employee.find({ firstName: 'Updated!' });
			expect(employees.length).to.be.equal(2);
		});

		afterEach(async () => {
			await Employee.deleteMany();
		});
	});
	describe('Removing data', () => {
		beforeEach(async () => {
			const testEmpOne = new Employee({ firstName: 'Jane', lastName: 'Doe', department: 'IT' });
			await testEmpOne.save();

			const testEmpTwo = new Employee({ firstName: 'Jack', lastName: 'Doe', department: 'MARKETING' });
			await testEmpTwo.save();
		});

		it('should properly remove one document with "deleteOne" method', async () => {
			await Employee.deleteOne({ firstName: 'Jane', lastName: 'Doe', department: 'IT' });
			const removeEmployee = await Employee.findOne({ firstName: 'Jane', lastName: 'Doe', department: 'IT' });
			expect(removeEmployee).to.be.null;
		});

		it('should properly remove one document with "remove" method', async () => {
			const employee = await Employee.findOne({ firstName: 'Jane', lastName: 'Doe', department: 'IT' });
			await employee.remove();
			const removedEmployee = await Employee.findOne({ firstName: 'Jane', lastName: 'Doe', department: 'IT' });
			expect(removedEmployee).to.be.null;
		});

		it('should properly remove multiple documents with "deleteMany" method', async () => {
			await Employee.deleteMany();
			const employees = await Employee.find();
			expect(employees.length).to.be.equal(0);
		});

		afterEach(async () => {
			await Employee.deleteMany();
		});
	});
	describe('Populate department', () => {
		beforeEach(async () => {
			const testDep = new Department({ name: 'Department #1' });
			await testDep.save();
			const department = await Department.findOne({ name: 'Department #1' });
			const testEmp = new Employee({ firstName: 'Jack', lastName: 'Doe', department: department.id });
			await testEmp.save();
		});

		it('should properly populate department field', async () => {
			const employee = await Employee.findOne({ firstName: 'Jack' }).populate('department');
			expect(employee.department.name).to.be.equal('Department #1');
		});

		afterEach(async () => {
			await Employee.deleteMany();
			await Department.deleteMany();
		});
	});
});
