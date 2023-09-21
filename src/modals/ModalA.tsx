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

interface ModalAProps {
  show: boolean;
  onHide: () => void;
  onlyEven: boolean;
}

const ModalA: React.FC<ModalAProps> = ({ show, onHide, onlyEven }) => {
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
          Authorization: API_TOKEN,
        },
        params: {
          companyId: 560,
          query: searchTerm,
          page,
          countryId: onlyEven ? 226 : undefined,
          noGroupDuplicates: 1,
        },
      });

      const { total, contacts_ids, contacts: contactsData } = response.data;

      const newContacts: Contact[] = contacts_ids.map(
        (contactId: number) => contactsData[contactId]
      );

      setContacts([...contacts, ...newContacts]);
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
          <Modal.Title>Modal A</Modal.Title>
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
          {contacts.map((contact, index) => (
            <div key={index} onClick={() => openModalC(contact)}>
              {contact.first_name} {contact.last_name}
            </div>
          ))}
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

export default ModalA;
