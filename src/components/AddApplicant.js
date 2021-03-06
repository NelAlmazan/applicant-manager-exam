import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "mapbox-gl-geocoder";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";

import { Button, Layout, Input, message, Spin } from "antd";

import { createApplicantMutation } from "../graphql/mutations";
import { getApplicantsQuery } from "../graphql/queries";

const styles = {
  width: "100%",
  height: "20vh",
};

const { Content } = Layout;

const AddApplicant = (props) => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [latitude, setLatitude] = useState(14.571801);
  const [longitude, setLongitude] = useState(121.050058);
  const [placeName, setPlaceName] = useState(
    "Pioneer Highlands, Madison, Mandaluyong, Metro Manila"
  );

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibmVsc2tpZHJlIiwiYSI6ImNrZmlnNjF0YjBndTkyeXBrcm1mYmIxeHEifQ.Ob0SZ1GqGlfWjD_Q0tOpLA";

    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: [121.050058, 14.571801],
        zoom: 13,
      });

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      });

      const marker = new mapboxgl.Marker({ draggable: false, color: "purple" })
        .setLngLat([121.050058, 14.571801])
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
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  const inputHandler = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "phone") {
      setPhone(e.target.value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    }
  };

  const onFinish = async (e) => {
    e.preventDefault();

    let createdApplicant = {
      id: props.match.params.id,
      name: name,
      username: username,
      phone: phone,
      email: email,
      address: placeName,
      lat: latitude.toFixed(4),
      lng: longitude.toFixed(4),
      status: "pending",
      category: null,
    };

    await props.createApplicantMutation({
      variables: createdApplicant,
      refetchQueries: [
        {
          query: getApplicantsQuery,
        },
      ],
    });

    message.success(`${name}'s Information has been successfully created!`);
    await props.history.push("/");
  };

  return (
    <Spin spinning={props.getApplicantsQuery.loading}>
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
              <Input name="address" value={placeName} disabled={true} />

              <label htmlFor="latitude">Latitude:</label>
              <Input name="latitude" value={latitude} disabled={true} />

              <label htmlFor="longitude">Longitude:</label>
              <Input name="longitude" value={longitude} disabled={true} />
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
    </Spin>
  );
};

export default compose(
  graphql(createApplicantMutation, { name: "createApplicantMutation" }),
  graphql(getApplicantsQuery, { name: "getApplicantsQuery" })
)(AddApplicant);
