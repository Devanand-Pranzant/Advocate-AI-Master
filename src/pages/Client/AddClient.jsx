// src/pages/ClientManagement/AddClient.jsx
import React, { useState, useEffect } from "react";
import { useTheme } from "../../components/Settings/themeUtils";
// import { useToast } from "../../components/Common/CostumeTost";
import Button from "../../components/Common/Button";
// import "./add_client.css";

const AddClient = ({ onClose, onSuccess }) => {
  const { themeUtils, theme } = useTheme();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Gender: "male",
    DOB: "",
    PhoneNo: "",
    Email: "",
    AddressLine1: "",
    AddressLine2: "",
    Country: "",
    State: "",
    City: "",
    Pin: ""
  });

  // Location states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      // This would be your API endpoint
      const response = await fetch('/api/fetch_country.php?type=countries');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (country) => {
    try {
      const response = await fetch(`/api/fetch_country.php?type=states&country=${encodeURIComponent(country)}`);
      const data = await response.json();
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (state) => {
    try {
      const response = await fetch(`/api/fetch_country.php?type=cities&state=${encodeURIComponent(state)}`);
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Handle location cascading
    if (name === "Country") {
      setFormData(prev => ({ ...prev, Country: value, State: "", City: "" }));
      if (value) fetchStates(value);
    } else if (name === "State") {
      setFormData(prev => ({ ...prev, State: value, City: "" }));
      if (value) fetchCities(value);
    }
  };

  const validateNumber = (input) => {
    const regex = /^[0-9+]*$/;
    const maxLength = 10;
    const minLength = 10;
    
    if (!regex.test(input.value)) {
      input.setCustomValidity("Please enter a valid number (digits and plus sign only).");
    } else if (input.value.length < minLength || input.value.length > maxLength) {
      input.setCustomValidity(`Please enter ${maxLength} Digit Number.`);
    } else {
      input.setCustomValidity("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/add-client.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.status === 'success') {
        toast.success("Success", "Client added successfully!");
        onSuccess();
      } else {
        toast.error("Error", result.message);
      }
    } catch (error) {
      console.error("Error adding client:", error);
      toast.error("Error", "An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ backgroundColor: themeUtils.getBgColor() }}>
      <div className="header-row" style={{ padding: "0 20px" }}>
        <h2 style={{ color: "#aa9166" }}>Add Client</h2>
        <Button variant="secondary" onClick={onClose}>Back</Button>
      </div>
      <hr className="col-md-12 hr" />

      <form id="clientForm" onSubmit={handleSubmit} style={{ padding: "0 20px 20px 20px" }}>
        {/* Personal Details Section */}
        <div className="form-section">
          <h2 style={{ color: "#aa9166" }}>Personal Details</h2>
          <div className="row">
            <div className="col-md-4 form-group">
              <label style={{ color: themeUtils.getTextColor() }}>
                First Name<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
            <div className="col-md-4 form-group">
              <label style={{ color: themeUtils.getTextColor() }}>
                Last Name<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
            <div className="col-md-4 form-group">
              <label style={{ color: themeUtils.getTextColor() }}>
                Gender<span style={{ color: "red" }}>*</span>
              </label>
              <select
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                className="custom-select"
                required
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 form-group">
              <label style={{ color: themeUtils.getTextColor() }}>
                Birthdate<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="date"
                name="DOB"
                value={formData.DOB}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
            <div className="col-md-4 form-group">
              <label style={{ color: themeUtils.getTextColor() }}>
                Contact<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="PhoneNo"
                value={formData.PhoneNo}
                onChange={handleChange}
                onInput={(e) => validateNumber(e.target)}
                required
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
            <div className="col-md-4 form-group">
              <label style={{ color: themeUtils.getTextColor() }}>
                Email<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
          </div>
        </div>

        <hr />

        {/* Address Details Section */}
        <div className="form-section">
          <h2 style={{ color: "#aa9166" }}>Address Details</h2>
          <div className="row">
            <div className="col-md-6 form-group">
              <label style={{ color: themeUtils.getTextColor() }}>
                Address Line 1<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="AddressLine1"
                value={formData.AddressLine1}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
            <div className="col-md-6 form-group">
              <label style={{ color: themeUtils.getTextColor() }}>Address Line 2</label>
              <input
                type="text"
                name="AddressLine2"
                value={formData.AddressLine2}
                onChange={handleChange}
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-3 form-group">
              <label style={{ color: themeUtils.getTextColor() }}>
                Country<span style={{ color: "red" }}>*</span>
              </label>
              <select
                name="Country"
                value={formData.Country}
                onChange={handleChange}
                className="custom-select"
                required
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              >
                <option value="">Select Country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3 form-group">
              <label style={{ color: themeUtils.getTextColor() }}>
                State<span style={{ color: "red" }}>*</span>
              </label>
              <select
                name="State"
                value={formData.State}
                onChange={handleChange}
                className="custom-select"
                required
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              >
                <option value="">Select State</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3 form-group">
              <label style={{ color: themeUtils.getTextColor() }}>
                City<span style={{ color: "red" }}>*</span>
              </label>
              <select
                name="City"
                value={formData.City}
                onChange={handleChange}
                className="custom-select"
                required
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              >
                <option value="">Select City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3 form-group">
              <label style={{ color: themeUtils.getTextColor() }}>
                Pin<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="Pin"
                value={formData.Pin}
                onChange={handleChange}
                placeholder="411017"
                required
                style={{
                  backgroundColor: themeUtils.getBgColor("input"),
                  color: themeUtils.getTextColor(),
                  borderColor: "#aa9166"
                }}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="row">
          <div className="col-md-12 form-actions">
            <Button type="submit" variant="primary" loading={loading}>
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddClient;