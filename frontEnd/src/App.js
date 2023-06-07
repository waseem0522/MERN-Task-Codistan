import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Modal, Button } from 'react-bootstrap';
function App() {
  debugger
  const [data, setData] = useState([]);
  const [childdata, setChildData] = useState([]);
  debugger
  const [pagecount, setPagecount] = useState(false);
  debugger
  const [show, setShow] = useState(false);


  debugger
  useEffect(() => {
    // axios.get('http://localhost:8000/parents?page=${currentPage}')
    //   .then(res =>
    //     setData(res.data))
    //   .catch(error => console.error(error));
    allData(pagecount)

  }, [pagecount]);

  const allData =async (page) => {
    const currentPage = page
     await axios.get(`http://localhost:8000/parents?page=${currentPage}`)
    .then(res =>
      setData(res.data))
    .catch(error => console.error(error));
  }
  // console.log(res)
  console.log(data)
  const handlechilde = (id) => {
    debugger
    const parentId = id
    axios.get(`http://localhost:8000/children/${parentId}`)
      .then(res =>
        setChildData(res.data))
      .catch(error => console.error(error));

  }
  // const modelfunction = () => {
  //   setModel(true)
  //   return(

  //   )
  // }
  return (
    <div className='container'>

      {data != undefined ?
        <table className="table align-middle mb-0 bg-white">
          <thead className="bg-light">
            <tr>
              <th>Sender</th>
              <th>ID</th>
              <th>Receiver</th>
              <th>Total Amount</th>
              <th>Total Paid Amount</th>
            </tr>
          </thead>
          <tbody>
            {data != undefined ? data.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                        alt=""
                        style={{ width: 45, height: 45 }}
                        className="rounded-circle"
                      />
                      <div className="ms-3">
                        <p className="fw-bold mb-1">{item.sender}</p>
                        <p className="text-muted mb-0">john.doe@gmail.com</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="fw-normal mb-1">{item.id}</p>

                  </td>
                  <td>
                    <p className="fw-normal mb-1">{item.receiver}</p>

                  </td>
                  <td>
                    <p className="fw-normal mb-1">{item.totalAmount}</p>
                  </td>
                  <td>{item.totalPaidAmount}</td>
                  <td>
                    <button type="button" className="btn btn-link btn-sm btn-rounded" onClick={() => (handlechilde(item.id), setShow(true))}>
                      Paid Amount
                    </button>
                    <Modal show={show} >
                      <Modal.Header closeButton>
                        <Modal.Title>Modal Title</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <table class="table">
                          <thead>
                            <tr>
                              <th scope="col">ID</th>
                              <th scope="col">Sender</th>
                              <th scope="col">Receiver</th>
                              <th scope="col">Total Amount</th>
                              <th scope="col">Paid Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              childdata != undefined ? childdata.map((data, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{data.id}</td>
                                    <td>{item.sender}</td>
                                    <td>{item.receiver}</td>
                                    <td>{item.totalAmount}</td>
                                    <td>{data.paidAmount}</td>
                                  </tr>
                                )
                              }) : console.log('error')
                            }
                          </tbody>
                        </table>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShow(false)}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </td>
                </tr>
              )
            }) : console.log('error')
            }
            {/* <tr>
          <td>
            <div className="d-flex align-items-center">
              <img
                src="https://mdbootstrap.com/img/new/avatars/6.jpg"
                className="rounded-circle"
                alt=""
                style={{ width: 45, height: 45 }}
              />
              <div className="ms-3">
                <p className="fw-bold mb-1">Alex Ray</p>
                <p className="text-muted mb-0">alex.ray@gmail.com</p>
              </div>
            </div>
          </td>
          <td>
            <p className="fw-normal mb-1">Consultant</p>
            <p className="text-muted mb-0">Finance</p>
          </td>
          <td>
            <span className="badge badge-primary rounded-pill d-inline">
              Onboarding
            </span>
          </td>
          <td>Junior</td>
          <td>
            <button
              type="button"
              className="btn btn-link btn-rounded btn-sm fw-bold"
              data-mdb-ripple-color="dark"
            >
              Edit
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <div className="d-flex align-items-center">
              <img
                src="https://mdbootstrap.com/img/new/avatars/7.jpg"
                className="rounded-circle"
                alt=""
                style={{ width: 45, height: 45 }}
              />
              <div className="ms-3">
                <p className="fw-bold mb-1">Kate Hunington</p>
                <p className="text-muted mb-0">kate.hunington@gmail.com</p>
              </div>
            </div>
          </td>
          <td>
            <p className="fw-normal mb-1">Designer</p>
            <p className="text-muted mb-0">UI/UX</p>
          </td>
          <td>
            <span className="badge badge-warning rounded-pill d-inline">
              Awaiting
            </span>
          </td>
          <td>Senior</td>
          <td>
            <button
              type="button"
              className="btn btn-link btn-rounded btn-sm fw-bold"
              data-mdb-ripple-color="dark"
            >
              Edit
            </button>
          </td>
        </tr> */}
          </tbody>
        </table>

        : (<h1>error</h1>)
      }
     <nav aria-label="Page navigation example">
  <ul className="pagination" style={{ justifyContent: 'center', alignItems: 'center', marginTop: '10px'}}>
    <li className="page-item">
      <a className="page-link" href="#" onClick={(e) => setPagecount(0)}>
        Previous
      </a>
    </li>
    <li className="page-item" >
      <a className="page-link" href="#" onClick={(e) => setPagecount(1)}>
        1
      </a>
    </li>
    <li className="page-item">
      <a className="page-link" href="#" onClick={(e) => setPagecount(2)}>
        2
      </a>
    </li>
    <li className="page-item">
      <a className="page-link" href="#" onClick={(e) => setPagecount(3)}>
        3
      </a>
    </li>
    <li className="page-item">
      <a className="page-link" href="#" onClick={(e) => setPagecount(4)}>
        Next
      </a>
    </li>
  </ul>
</nav>

    </div>
  );
}

export default App;
