import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "mapbox-gl-geocoder";
import { Button, Layout, Label, Input, Form, message } from "antd";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";
import { flowRight as compose, set } from "lodash";

import {
  moveApplicantMutation,
  deleteApplicantMutation,
  saveOrRejectApplicantMutation,
  updateApplicantMutation,
} from "../graphql/mutations";

import { getApplicantQuery } from "../graphql/queries";

const { Content } = Layout;

const styles = {
  width: "100%",
  height: "20vh",
};

const ViewAndEditApplicant = (props) => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  const applicantData = props.getApplicantQuery.getApplicantById;

  // console.log("APPLICANT DATA", applicantData);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [currentLngLat, setCurrentLngLat] = useState([]);

  // console.log(
  //   "INITIAL DATA",
  //   name,
  //   username,
  //   phone,
  //   email,
  //   placeName,
  //   longitude,
  //   latitude,
  //   status,
  //   category
  // );

  useEffect(() => {
    const setInitialValues = async () => {
      await setName(applicantData && applicantData.name);
      await setUsername(applicantData && applicantData.username);
      await setPhone(applicantData && applicantData.phone);
      await setEmail(applicantData && applicantData.email);
      await setStatus(applicantData && applicantData.status);
      await setCategory(applicantData && applicantData.category);
      await setLatitude(applicantData && parseFloat(applicantData.lat));
      await setLongitude(applicantData && parseFloat(applicantData.lng));
      await setPlaceName(applicantData && applicantData.address);
    };

    setInitialValues();

    mapboxgl.accessToken =
      "pk.eyJ1IjoibmVsc2tpZHJlIiwiYSI6ImNrZmlnNjF0YjBndTkyeXBrcm1mYmIxeHEifQ.Ob0SZ1GqGlfWjD_Q0tOpLA";

    // const coordinates = document.getElementById("coordinates");

    const initializeMap = ({ setMap, mapContainer }) => {
      console.log("LONG", longitude);
      console.log("LAT", latitude);
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: [longitude, latitude],
        zoom: 13,
      });

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        marker: {
          color: "orange",
        },
        mapboxgl: mapboxgl,
      });

      const marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat([longitude, latitude])
        .addTo(map);

      map.addControl(geocoder);

      map.on("load", () => {
        map.addSource("single-point", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });

        geocoder.on("result", function (e) {
          map.getSource("single-point").setData(e.result.geometry);
          setLatitude(e.result.center[1]);
          setLongitude(e.result.center[0]);
          setPlaceName(e.result.place_name);
          marker.setLngLat([e.result.center[0], e.result.center[1]]);
        });

        setMap(map);
        map.resize();
      });

      map.on("move", async () => {
        geocoder.on("result", function (e) {
          map.getSource("single-point").setData(e.result.geometry);
          setLatitude(e.result.center[1]);
          setLongitude(e.result.center[0]);
          setPlaceName(e.result.place_name);
        });
        await setLatitude(map.getCenter().lat);
        await setLongitude(map.getCenter().lng);
      });

      // const onDragEnd = async () => {
      //   let lngLat = marker.getLngLat();
      //   coordinates.style.display = "block";
      //   coordinates.innerHTML =
      //     "Longitude: " + lngLat.lng + "<br />longitude: " + lngLat.lat;

      //   setLatitude(lngLat.lat);
      //   setLongitude(lngLat.lng);
      // };

      // marker.on("dragend", onDragEnd);
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };

  const validateMessages = {
    required: "'${label}' is required!",
    types: {
      email: "'${label}' is not a valid email!",
      number: "'${label}' is not a valid number!",
    },
    number: {
      range: "'${label}' must be between '${min}' and '${max}'",
    },
  };

  const inputHandler = (e) => {
    console.log(e.target.name);
    if (e.target.name === "name") {
      setName(e.target.value);
    } else if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "phone") {
      setPhone(e.target.value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "status") {
      setStatus(e.target.value);
    } else if (e.target.name === "category") {
      setCategory(e.target.value);
    }
  };

  const onFinish = async (e) => {
    e.preventDefault();

    let updatedApplicant = {
      id: props.match.params.id,
      name: name,
      username: username,
      phone: phone,
      email: email,
      address: placeName,
      lat: latitude.toFixed(4),
      lng: longitude.toFixed(4),
      status: status,
      category: category,
    };

    await props.updateApplicantMutation({
      variables: updatedApplicant,
      refetchQueries: [
        {
          variables: {
            id: props.match.params.id,
          },
          query: getApplicantQuery,
        },
      ],
    });

    await message.success(
      `${name}'s Information has been successfully updated!`
    );
    await props.history.push("/");
  };

  return (
    <div style={{ margin: "auto", maxWidth: "50rem" }}>
      <h2 style={{ marginLeft: 10 }}>Applicant Information</h2>
      <Layout>
        <Content style={{ padding: "20px" }}>
          <form onSubmit={onFinish} noValidate>
            <label htmlFor="name">Name:</label>
            <Input name="name" value={name} onChange={inputHandler} />

            <label htmlFor="username">Username:</label>
            <Input name="username" value={username} onChange={inputHandler} />

            <label htmlFor="email">Email:</label>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={inputHandler}
            />

            <label htmlFor="phone">Phone:</label>
            <Input name="phone" value={phone} onChange={inputHandler} />

            <label htmlFor="phone">Address:</label>
            <Input
              name="address"
              value={placeName}
              onChange={inputHandler}
              disabled={true}
            />

            <label htmlFor="latitude">Latitude:</label>
            <Input
              name="latitude"
              value={latitude}
              onChange={inputHandler}
              disabled={true}
            />

            <label htmlFor="longitude">Longitude:</label>
            <Input
              name="longitude"
              value={longitude}
              onChange={inputHandler}
              disabled={true}
            />
            <div ref={(el) => (mapContainer.current = el)} style={styles} />
            {/* <pre
              id="coordinates"
              // ref={(el) => (mapContainer.coordinates = el)}
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                position: "absolute",
                bottom: "40px",
                right: "10px",
                padding: "5px 10px",
                margin: 0,
                fontSize: "11px",
                lineGeight: "18px",
                borderRadius: "3px",
                display: "none",
              }}
            /> */}

            <Link to="/">
              <Button type="text" htmlType="back" style={{ margin: 5 }}>
                Go Back
              </Button>
            </Link>
            <Button type="primary" htmlType="submit" style={{ margin: 5 }}>
              Save
            </Button>
          </form>
        </Content>
      </Layout>
    </div>
  );
};

export default compose(
  graphql(saveOrRejectApplicantMutation, {
    name: "saveOrRejectApplicantMutation",
  }),
  graphql(moveApplicantMutation, { name: "moveApplicantMutation" }),
  graphql(deleteApplicantMutation, { name: "deleteApplicantMutation" }),
  graphql(updateApplicantMutation, { name: "updateApplicantMutation" }),
  graphql(getApplicantQuery, {
    options: (props) => {
      return {
        variables: {
          id: props.match.params.id,
        },
      };
    },
    name: "getApplicantQuery",
  })
)(ViewAndEditApplicant);
