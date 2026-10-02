require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Flat = require('./models/Flat');
const Notice = require('./models/Notice');
const Complaint = require('./models/Complaint');
const Visitor = require('./models/Visitor');
const Bill = require('./models/Bill');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([
    User.deleteMany(), Flat.deleteMany(), Notice.deleteMany(),
    Complaint.deleteMany(), Visitor.deleteMany(), Bill.deleteMany()
  ]);

  const pass = await bcrypt.hash('123456', 10);

  const flats = await Flat.insertMany([
    { block: 'A', flatNumber: '101', status: 'occupied' },
    { block: 'A', flatNumber: '102', status: 'occupied' },
    { block: 'B', flatNumber: '201', status: 'occupied' },
    { block: 'B', flatNumber: '202', status: 'vacant' }
  ]);

  const admin = await User.create({ name: 'Admin', email: 'admin@society.com', password: pass, role: 'admin', phone: '9000000001' });
  await User.create({ name: 'Guard Ramesh', email: 'guard@society.com', password: pass, role: 'guard', phone: '9000000002' });
  const r1 = await User.create({ name: 'Rahul Sharma', email: 'rahul@society.com', password: pass, role: 'resident', phone: '9000000003', flat: flats[0]._id });
  const r2 = await User.create({ name: 'Priya Singh', email: 'priya@society.com', password: pass, role: 'resident', phone: '9000000004', flat: flats[1]._id });

  flats[0].owner = r1._id; await flats[0].save();
  flats[1].owner = r2._id; await flats[1].save();

  await Notice.insertMany([
    { title: 'Water Supply Cut', message: 'Water supply will be off on Sunday 10 AM to 2 PM.', postedBy: admin._id },
    { title: 'Society Meeting', message: 'Monthly meeting on Saturday at 6 PM in the clubhouse.', postedBy: admin._id }
  ]);

  await Complaint.insertMany([
    { title: 'Lift not working', description: 'Lift in Block A is stuck on 2nd floor.', category: 'maintenance', status: 'open', raisedBy: r1._id, flat: flats[0]._id },
    { title: 'Street light broken', description: 'Light near gate 2 is not working.', category: 'electrical', status: 'in-progress', raisedBy: r2._id, flat: flats[1]._id }
  ]);

  await Visitor.insertMany([
    { name: 'Amit Kumar', phone: '9111111111', purpose: 'Delivery', flat: flats[0]._id },
    { name: 'Sunita Devi', phone: '9222222222', purpose: 'Relative visit', flat: flats[1]._id }
  ]);

  await Bill.insertMany([
    { flat: flats[0]._id, month: 'September 2026', amount: 2500, status: 'paid', dueDate: new Date('2026-09-10') },
    { flat: flats[0]._id, month: 'October 2026', amount: 2500, status: 'unpaid', dueDate: new Date('2026-10-10') },
    { flat: flats[1]._id, month: 'October 2026', amount: 2500, status: 'unpaid', dueDate: new Date('2026-10-10') }
  ]);

  console.log('Seed done');
  process.exit();
};

run();