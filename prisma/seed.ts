import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      name: 'System Administrator',
      role: Role.ADMIN,
      password: adminPassword,
    },
  })

  // Create HR user
  const hrPassword = await bcrypt.hash('hr123', 10)
  const hrUser = await prisma.user.upsert({
    where: { email: 'hr@company.com' },
    update: {},
    create: {
      email: 'hr@company.com',
      name: 'HR Manager',
      role: Role.HR,
      password: hrPassword,
      employee: {
        create: {
          employeeCode: 'HR001',
          firstName: 'Sarah',
          lastName: 'Johnson',
          position: 'HR Manager',
          department: 'Human Resources',
          hireDate: new Date('2020-01-15'),
          salary: 75000,
          phone: '+1-555-0101',
          address: '123 Main St, City, State 12345',
          emergencyContact: 'John Johnson - +1-555-0102',
        },
      },
    },
    include: {
      employee: true,
    },
  })

  // Create manager user
  const managerPassword = await bcrypt.hash('manager123', 10)
  const manager = await prisma.user.upsert({
    where: { email: 'manager@company.com' },
    update: {},
    create: {
      email: 'manager@company.com',
      name: 'Team Manager',
      role: Role.MANAGER,
      password: managerPassword,
      employee: {
        create: {
          employeeCode: 'MGR001',
          firstName: 'Michael',
          lastName: 'Smith',
          position: 'Engineering Manager',
          department: 'Engineering',
          hireDate: new Date('2019-03-10'),
          salary: 95000,
          phone: '+1-555-0201',
          address: '456 Oak Ave, City, State 12345',
          emergencyContact: 'Lisa Smith - +1-555-0202',
        },
      },
    },
    include: {
      employee: true,
    },
  })

  // Create employee users
  const employeePassword = await bcrypt.hash('employee123', 10)
  
  const employee1 = await prisma.user.upsert({
    where: { email: 'john.doe@company.com' },
    update: {},
    create: {
      email: 'john.doe@company.com',
      name: 'John Doe',
      role: Role.EMPLOYEE,
      password: employeePassword,
      employee: {
        create: {
          employeeCode: 'EMP001',
          firstName: 'John',
          lastName: 'Doe',
          position: 'Software Developer',
          department: 'Engineering',
          hireDate: new Date('2021-06-01'),
          salary: 70000,
          phone: '+1-555-0301',
          address: '789 Pine St, City, State 12345',
          emergencyContact: 'Jane Doe - +1-555-0302',
        },
      },
    },
    include: {
      employee: true,
    },
  })

  const employee2 = await prisma.user.upsert({
    where: { email: 'jane.smith@company.com' },
    update: {},
    create: {
      email: 'jane.smith@company.com',
      name: 'Jane Smith',
      role: Role.EMPLOYEE,
      password: employeePassword,
      employee: {
        create: {
          employeeCode: 'EMP002',
          firstName: 'Jane',
          lastName: 'Smith',
          position: 'UX Designer',
          department: 'Design',
          hireDate: new Date('2021-08-15'),
          salary: 65000,
          phone: '+1-555-0401',
          address: '321 Elm St, City, State 12345',
          emergencyContact: 'Bob Smith - +1-555-0402',
        },
      },
    },
    include: {
      employee: true,
    },
  })

  console.log('Database seeded successfully!')
  console.log('Users created:')
  console.log('- Admin: admin@company.com / admin123')
  console.log('- HR: hr@company.com / hr123')
  console.log('- Manager: manager@company.com / manager123')
  console.log('- Employee 1: john.doe@company.com / employee123')
  console.log('- Employee 2: jane.smith@company.com / employee123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
