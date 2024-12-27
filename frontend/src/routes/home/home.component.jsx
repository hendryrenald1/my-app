import MemberList from '../../components/members/member-list.component'; 

const members = [ 
  {
    id: 1,
    name: 'John Doe',
    contactNo: '1234567890',
    email: 'abc@abc.com',
    branch: 'CSE',
    joinedOn: '2021-01-01',
    baptism: 'yes',
  },
  {
    id: 2,
    name: 'Jane Smith',
    contactNo: '0987654321',
    email: 'jane@abc.com',
    branch: 'ECE',
    joinedOn: '2020-05-15',
    baptism: 'no',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    contactNo: '1122334455',
    email: 'alice@abc.com',
    branch: 'ME',
    joinedOn: '2019-08-20',
    baptism: 'yes',
  },
  {
    id: 4,
    name: 'Bob Brown',
    contactNo: '2233445566',
    email: 'bob@abc.com',
    branch: 'CE',
    joinedOn: '2018-11-30',
    baptism: 'no',
  },
  {
    id: 5,
    name: 'Charlie Davis',
    contactNo: '3344556677',
    email: 'charlie@abc.com',
    branch: 'EEE',
    joinedOn: '2021-03-10',
    baptism: 'yes',
  },
  {
    id: 6,
    name: 'Diana Evans',
    contactNo: '4455667788',
    email: 'diana@abc.com',
    branch: 'IT',
    joinedOn: '2020-07-25',
    baptism: 'no',
  },
  {
    id: 7,
    name: 'Ethan Foster',
    contactNo: '5566778899',
    email: 'ethan@abc.com',
    branch: 'CSE',
    joinedOn: '2019-12-05',
    baptism: 'yes',
  },
  {
    id: 8,
    name: 'Fiona Green',
    contactNo: '6677889900',
    email: 'fiona@abc.com',
    branch: 'ECE',
    joinedOn: '2018-04-18',
    baptism: 'no',
  },
  {
    id: 9,
    name: 'George Harris',
    contactNo: '7788990011',
    email: 'george@abc.com',
    branch: 'ME',
    joinedOn: '2021-09-22',
    baptism: 'yes',
  },
  {
    id: 10,
    name: 'Hannah White',
    contactNo: '8899001122',
    email: 'hannah@abc.com',
    branch: 'CE',
    joinedOn: '2020-02-14',
    baptism: 'no',
  }
];

  const Home = () =>  {

    return (<MemberList members={members} />)

  }
  
  export default Home;
