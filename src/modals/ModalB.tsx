import React, { useEffect, useState } from "react";
import { Modal, FormControl, Spinner } from "react-bootstrap";
import axios from "axios";
import ModalC from "./ModalC";
import { API_TOKEN, API_URL } from "../constants";
interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone_number: string | null;
  country_id: number;
}

interface ModalBProps {
  show: boolean;
  onHide: () => void;
  onlyEven: boolean;
}

const ModalB: React.FC<ModalBProps> = ({ show, onHide, onlyEven }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [showModalC, setShowModalC] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
        params: {
          companyId: 560,
          query: searchTerm,
          page,
          countryId: 226, // for us country only
          noGroupDuplicates: 1,
        },
      });

      const { total, contacts_ids, contacts: contactsData } = response.data;

      // Create an array of contact objects based on the IDs
      const newContacts: Contact[] = contacts_ids.map(
        (contactId: number) => contactsData[contactId]
      );
      const filteredContacts = onlyEven
        ? newContacts.filter((contact) => contact.id % 2 === 0)
        : newContacts;
      setContacts(filteredContacts);
      //setContacts([...contacts, ...newContacts]);
      setHasMore(contacts.length < total);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm !== "") {
      setContacts([]);
      setPage(1);
      setHasMore(true);
      loadContacts();
    }
  }, [searchTerm, onlyEven]);

  useEffect(() => {
    if (!loading && hasMore) {
      const handleScroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
        ) {
          setPage(page + 1);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [loading, hasMore, page]);

  const openModalC = (contact: Contact) => {
    setSelectedContact(contact);
    setShowModalC(true);
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modal B</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <FormControl
            type="text"
            placeholder="Search"
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Render contact list */}
          {contacts.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, index) => (
                  <tr key={index} onClick={() => openModalC(contact)}>
                    <td>{contact.id}</td>
                    <td>{contact.first_name}</td>
                    <td>{contact.last_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No contacts to display.</p>
          )}

          {loading && <Spinner animation="border" />}
        </Modal.Body>
      </Modal>
      {/* Render ModalC */}
      {selectedContact && (
        <ModalC
          show={showModalC}
          onHide={() => setShowModalC(false)}
          contact={selectedContact}
        />
      )}
    </>
  );
};

export default ModalB;
