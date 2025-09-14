import { useEffect, useState } from "react";
import {getAllPublishers, getAllAuthors, createBook, getBookById, updateBook, createAuthor, createPublisher} from "../service/service";
import { useNavigate } from "react-router-dom";

export const useBookForm = (id) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    publicationDate: "",
    pages: "",
    authorId: "",
    publisherId: "",
    newAuthorName: "",
    newPublisherName: "",
    newPublisherAddress: "",
    newPublisherWebsite: "",
  });

  const [publishers, setPublishers] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showNewAuthor, setShowNewAuthor] = useState(false);
  const [showNewPublisher, setShowNewPublisher] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pubs, auths] = await Promise.all([getAllPublishers(), getAllAuthors()]);
        const pubsArr = Array.isArray(pubs) ? pubs : [];
        const authsArr = Array.isArray(auths) ? auths : [];
        setPublishers(pubsArr);
        setAuthors(authsArr);
      } catch (e) {
        setMessage("Failed to load data.");
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!id) return;
    const loadBook = async () => {
      try {
        const book = await getBookById(id);
        setFormData(prev => ({
          ...prev,
          title: book.title || "",
          isbn: book.isbn || "",
          publicationDate: book.publishedDate ? book.publishedDate.split("T")[0] : "",
          pages: book.pageCount?.toString() || "",
          authorId: book.authorId?.toString() || "",
          publisherId: book.publisherId?.toString() || "",
        }));
      } catch (e) {
        setMessage("Failed to load book.");
      }
    };
    loadBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value ?? "" }));
  };

  const handleAuthorChange = (value) => {
    if (value === "new") {
      setShowNewAuthor(true);
      setFormData(prev => ({ ...prev, authorId: "", newAuthorName: "" }));
    } else {
      setShowNewAuthor(false);
      setFormData(prev => ({ ...prev, authorId: value, newAuthorName: "" }));
    }
  };

  const handlePublisherChange = (value) => {
    if (value === "new") {
      setShowNewPublisher(true);
      setFormData(prev => ({ 
        ...prev, 
        publisherId: "", 
        newPublisherName: "",
        newPublisherAddress: "",
        newPublisherWebsite: ""
      }));
    } else {
      setShowNewPublisher(false);
      setFormData(prev => ({ 
        ...prev, 
        publisherId: value,
        newPublisherName: "",
        newPublisherAddress: "",
        newPublisherWebsite: ""
      }));
    }
  };

  const createNewAuthor = async () => {
    if (!formData.newAuthorName.trim()) return null;
    
    try {
      const newAuthor = await createAuthor({
        id: 0,
        fullName: formData.newAuthorName.trim(),
        biography: "",
        dateOfBirth: "2025-01-01T00:00:00Z"
      });
      
      setAuthors(prev => [...prev, newAuthor]);
      return newAuthor.id;
    } catch (e) {
      throw new Error("Failed to create author");
    }
  };

  const createNewPublisher = async () => {
    if (!formData.newPublisherName.trim()) return null;
    
    try {
      const newPublisher = await createPublisher({
        id: 0,
        name: formData.newPublisherName.trim(),
        address: formData.newPublisherAddress.trim() || "",
        website: formData.newPublisherWebsite.trim() || ""
      });
      
      setPublishers(prev => [...prev, newPublisher]);
      return newPublisher.id;
    } catch (e) {
      throw new Error("Failed to create publisher");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.title.trim()) {
      setMessage("Title is required!");
      setLoading(false);
      return;
    }

    try {
      let authorId = formData.authorId;
      let publisherId = formData.publisherId;

      if (showNewAuthor) {
        if (!formData.newAuthorName.trim()) {
          setMessage("Author name is required!");
          setLoading(false);
          return;
        }
        authorId = await createNewAuthor();
      }

      if (showNewPublisher) {
        if (!formData.newPublisherName.trim()) {
          setMessage("Publisher name is required!");
          setLoading(false);
          return;
        }
        publisherId = await createNewPublisher();
      }

      if (!authorId || !publisherId) {
        setMessage("Author and Publisher are required!");
        setLoading(false);
        return;
      }

      const payload = {
        id: id ? parseInt(id, 10) : 0,
        title: formData.title.trim(),
        isbn: formData.isbn.trim() || null,
        publishedDate: formData.publicationDate || null,
        pageCount: formData.pages ? parseInt(formData.pages, 10) : null,
        authorId: parseInt(authorId, 10),
        publisherId: parseInt(publisherId, 10),
        author: null,
        publisher: null
      };

      if (id) {
        await updateBook(id, payload);
      } else {
        await createBook(payload);
      }
      
      navigate("/books");
    } catch (e) {
      setMessage(`Error ${id ? 'updating' : 'creating'} book. ${e.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/books");
  };

  return {
    formData,
    publishers,
    authors,
    loading,
    message,
    showNewAuthor,
    showNewPublisher,
    handleChange,
    handleAuthorChange,
    handlePublisherChange,
    handleSubmit,
    handleCancel
  };
};