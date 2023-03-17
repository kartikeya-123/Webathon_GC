import { Container, radioClasses } from "@mui/material";
import React, { useEffect, useState } from "react";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import {
  useJsApiLoader,
  DirectionsService,
  GoogleMap,
  Marker,
  Polyline,
  DirectionsRenderer,
  InfoBox,
  InfoWindow,
} from "@react-google-maps/api";
import {
  collection,
  setDoc,
  doc,
  getDocs,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../config";

const TrackOrder = ({
  setroute,
  setdata,
  setorderdelivered,
  selectedOrder,
}) => {
  const origin = { lat: 6.5244, lng: 3.3792 };

  const [Path, setpath] = useState(null);
  const destination = { lat: 6.4667, lng: 3.45 };
  const [dire, setd] = useState(null);
  const [post, setpos] = useState(null);
  const [index, setindex] = useState(40);
  const [open, isopen] = useState(true);

  const [droneLocation, setDroneLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAm8wWzqS9Rltn5WvhUGqGZPeJsmJkykNU",

    libraries:["places"]

 

  });

  const Move = (g) => {
    var x = [];
    for (var i = 0; i < g.length; i++) {
      x.push([g[i].lat(), g[i].lng()]);
    }
    setpath(x);
    var y = 0;
    const z = setInterval(() => {
      if (y >= x.length) {
        setorderdelivered(true);
        clearInterval(z);
        return;
      } else {
        setpos(x[y]);

        y = y + 1;
      }
    }, 1000);
  };

  const get = async () => {
    try {
      const directionsService = new window.google.maps.DirectionsService();
      const response = await directionsService.route({
        origin: selectedOrder.from,
        destination: selectedOrder.to,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setd(response);
    } catch (err) {
      console.log(err);
    }
  };

  const getDrone = () => {
    const droneId = selectedOrder.droneId;
    if (!droneId) return;

    const droneRef = doc(db, "Drones", droneId);

    onSnapshot(droneRef, (snapshot) => {
      const droneData = snapshot.data();
      setDroneLocation(droneData.location);
    });
  };
  useEffect(() => {
    get();
    getDrone();
  }, [selectedOrder]);

  if (!isLoaded) {
    return <></>;
  }
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <GoogleMap
        onLoad={() => {
          get();
        }}
        defaultCenter={{ lat: 6.5244, lng: 3.3792 }}
        zoom={10}
        mapContainerStyle={{ width: "95%", height: "30vh" }}
      >
        {droneLocation !== null && (
          <Marker
            // onClick={(e) => isopen(true)}
            position={droneLocation}
          >
            {/* {open === true && (
              <InfoWindow>
                <div>
                  <img
                    width={50}
                    height={50}
                    src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBIRERIPERIREREPEREPEhAPEREQEQ8PGBQZGRgUGBgcIS4lHB4rIRgYJjgnLC8xNTU1GiQ7QDs0Py41NTEBDAwMEA8QGhISHDEjISM1NDQ0MTQ0MTQ0PzE0NDQ0NDQ0MTExNDQxNDExNDQ3MTQ0NDE0MTQ0NDU0NDQ0NDE0NP/AABEIALcBEwMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAEAAECAwUGB//EAD4QAAICAQIDBAgDBgQHAQAAAAECAAMRBBIFITEGE0FxIjJRUmGBkaEHFLEjQmKSwdFTcoLhJERjorLC8BX/xAAZAQADAQEBAAAAAAAAAAAAAAAAAQIDBAX/xAAkEQADAQACAgIBBQEAAAAAAAAAAQIRAxIhMRNRIgQyQXGxkf/aAAwDAQACEQMRAD8A9FeyUPdB7LoFdqJz1ZDYY+ogz6mZ1uqgr6qY1yEtmk+pgtmomc+qlD6mZ/IyWw574O10CfUSpr4K2Qw1rJAvA++j97NJszoJLSJlQePunTHIYsliSVZANJoZurCWFUrNHTzOpM0aDKVG8s0qIZXAaTC0aVpoFoZarQVHkxZJdDQTukHMqLyD2SewxWNBLTLHeDO8ubMmUvKjJu0qzNpogmsJrgyGE1xtlJBlUOqgNUOrmdM0lBdcJWDIZcrTJs1ReDH3SoPFukaWWbopXuihoHF3aiZ9+plNuogF9886r0ybLrdTA31EGtugr2zMQa2olLXwRrJWzxYAW10gboGXjGyGCwNFskLYB3kdXlIhyaS2wipGboJRpagBubn8Ietk0lkuC2nRk9W+k0KeHJ7SZn124mjptQDNpsFCC00KCXJQoktOjOQqAsx8BFejo2x1Kt1wfZ7ZtNF9cL0rEvWs+EGreXo80VjRPJEbvJIHMpvTHMSKoeEmtlT3QR7ZQ90565Rhb3Sl7YI10ra2VPKZ0gpniDQTvJNHnTPIRgYhhVRgCNC6mm6rSkaNJhiNM+poUjyWzSQ9HkxZAe8iN0yqjRB/eRu9mc2ojfmZk6K00u9imb+Zii7hp57Zf8YHbbKntlLvOEyHd5QzxmaVkx4BItIFoxMgTDAHZpEtGJkCY8Anvk6H9IZ9sHzGzDBYdfVTuAIk/wAs0w+HcWKDa/TwM2F4gCMjBHwleB4Wip/ZL6K3zyGPODDXH2SxNQ7kIoJZiFVVGSxPQCAsOu7O2FBYzq7j0VUorYzzyM/SX8ctV1rYq6YLj0hnkdvLM0NLo1WtELAbVA2jJwcc+Q5dcx9Ro1ZSoYNkH0Tnn8jO1T+OF54wwKkHvAwpcCZADLyOQQcHwwfZLFs+M5+5CNfvAJXbcMTNNsE1OtA5Kcn2ya5CkLUW+kcQVroO9speyczrQCWukO9ghsjrk9ATBUxNBgslqPKK9LYf3frC69DZ8PrN4tkOS6t4ZU8GTSOPZL0qYTrixZgcjy5bYCCR1ERtmjoaDmvlT6j4wB74JZqZhdFpmk2q+Mh+amM+qlf5mc9UytN/83GmH+aik9mGnKF4xeDh5LdFhJMmMTI5jExgPmRJkkQtyAhdegz6xx5QwYAZAzoKOHVeOT84WOGVe6DGpDDkTFOmv0FY/cECbR1n93HkTDBGMJbXYy+qSIc/D18CR95Q+ideY5j4RNAW1cRYdQD9pr8J42KrO82ekFcLnBAcqQJzmCOssQwVOWmB0Wp7UalhuNuN2cIhO5CPeB5Y8jH03anUpsbvO8z667WwhzyBJGDn4TGpsJBTqHwCucBj4c/OaGgpKixUZt61jUVK/NXZBuYbegcYI81xO2OVUtX8Gkz29HSX8cWw7ih3EDcOWN2BmDPxInooHmczQ0PA69XRU6OKrxWq2bgSjtjxxzB/i8fZB9X2T1tQyK1tA8aXDf8AacMfpOO45N1ompymk9X2Z76pm6k+XhKWslWpR6ztsR0b3XVkP0MoayYMkveyPWhfp09sD35Im7ptP6AxBLSkgeuhR15n4wlHx0jtpm8JHuX9keYAfp7cw+pGYEqrMB12gnExa62HM4UDxM7ThGo2aesbLCTuPogqD6RwefwxOjhns8BIwHsk0ePxBB3z+smWLAMMcj4yKVjxYSk2nhLRZukLK93wMsBUeMg+oUTTsLDG1TlDgzPs1EI4vqgWwJjWWzOmNIue+Q7+BvZK98xYzR7+KZ/eRRYBmq0sBlKyxTLaEWZizI5jExAbekowgIHXxk2UjwMB4dxPu/Rfmvt9k2V1tbDIwZaKQIrkdIZp9UOh/vINfX7sJ4XtturpVdu9sEjGcAEnH0jS8gdbwXs/p79OtlgZmt3EEPsKDcQMD28vGcPrdI1VlleCQjugbHrBWIz9p6fp+HBAqpXgKOXNzjnnqTOM7T8JfT2h6y7C7e5UgttbOT5jn9pryRkp/Q2jATTMfDEITR46y/SafV3ErVU7kYyQmAM+0nkJq6fstrX52NVSPHe4Zh8kz+symXXpaLq/o5/W8NRlJHrY6zK4bwfUaiw1aetrGU+kRyRR7WY8lHnPTdD2T06c7rWvPuIO7X54JY+PiJv1lKkFdVaVIOiqAo88DqfOaLgb9+A6/ZzXAexFOl226pl1FwwVrA/Yo3kfWPxOB8Jx3G6rPzNiVhs7nxsycqf0nonEOIqinBycY3Hr/tOZ7P6hbNXYhx+0QkH+JWBx9CfpOiYmViQf0B8E4lbTYosrKKfR9JSA3zPWegaPX7gCrZHsPIj5zl+17iulEHrO+4fAKOv1ImJw7jZrwrEiWG4envqEddliKynqrqGUj55EydX2X4fdz7oVk/vUMa8f6R6P2mTpePg49IQ9OL1nmdvnJrjmva0fYxNd+Hp5nT6lW9iXqVP8y/2g1PZ7iNXoGkWKP367ayMeRIP2nTNxisdSf5mgt3aapP3j/MZi/wBNP8eA1GK3DtaP+Xs+S7v0gt66isgPW6EjIDIVJHtGZuntTWVDAjDHAJduuSMY+RP09s5/jmt1GpethWlaorAtfclfU+6zbvD2THl4HK2fLNuCIu0qeL7NDQcL1LvWz1P3e9GZn2qhTcCT6R5jE7Rqk8W+xYf7Tzi/tPbXUtSvWWREQGrNgYgY9Y4x9DMPXcW1LbX7y3DjOWG30vEDBOR9JvwwoXvyzOsmmkem8c0YavfWdxRgxHMEJg5wD8uk53cRMHRcY1CPyscoy9HZHJBU+6SBz8OsTap26uT88fpOf9RUqvDMmbdmoVepAmbqdfnkvL4mANZKHeYq2ArbII7x7LIMzytAdnkN0gzSO6Ay7dHlG6KAFSiWARgJICW0IaMTJGQMnAIkxK5HMEjyjGNAApNdYOpDeYnS9mO0FenWyw1hriypXz9VTnJB8MnlOQjq2OnKVNdaTA9ETt3abNhrVSCQdzhQMfxE4hFnbNr6nqQAPYjoP2oTaSCMsWIAHTnmebm5iAOXojAwqjl8cDn84rLWclmJJPUmbXzS01hc05aa9o7/AILr9Rp94ZKWDlDldVQ5XGc8t/xhep7Wd3kct4KAptwQCpJPl0+s8z3fExsyOPlUJJLwh8vLXJbqvbPUNJ2ivuDGut3C+ttGQIPqe0LDKsHU+xgQYD+HdhFerY5wDV9cPMvtNxkm7u0CkIPSyM5c88Z+Ax9TOn5V1VMgLu1dl52jPPlgcyZu9meCOl9VjHaQ2dvXlg5BPlmct2f4wovrDhVBbbknlzGOvhO/4BrDZqtgXCIjsfPkMfeVNKlqBF/aDhyXOpYZCJgc8Yycn+kxLez9R6ZHkf7wjtXxCtTfte2u5dqhyzrRkY67fDGfDrAUp1YUOQ2eWdn7Rc48CmeXniUNgt/Z1l5o/wAjkTMtS2slSzDHgZv08VKMEtsqX27rKwR8s5mfxJO8tstyjVZ9AixFG0Ac+cVVi0RXwVEts22MzY5hckA+c1u1HC61rrZK0Us4XKKF9Hax/tMCvVJWwKqQyn7zquIajv8Ahy3pzNTq7DxC80P0JH0mPy9peeGPDz7W6R6/S8OuRyIMCNhPMkk+0mafFOIArs8T4eyYwacVNt+xBCtLUeCq0mrzNiDkeTFkDV5IPFgBLPKneVM8qd45QDu8oZoneUs01SAkTI5kS0WZWDJ5ikMxQwAgCSxEIpbRKImVNLGlTGLBjNIEx2MrJiwCWYt0rJi3QwC3dH3SkNHDQ6gXZizK90nVWzsqL67sqKP42YAfcw6gd7wdfyfB7NS3r6py6A+6PQT5E5PkZwm8sck5JOST4knxnd/iVYtKaXQ18krQAAe4iBF/X7Tz/M05FmT9DZ6AbtOmjDhgl/dZZq62Fav/AAsicx/9mav4ccX/ADN16qLClVNfp3uz2u7v5kKvodB/SeXi1tu3c233dx2/TpPRfwiT0ta3w0q/e0zaOVN9cBezkePaW/Ua3WOiNYp1d64UM4UK5UZxyHICCsdbpNu23U1BfVAe5FHwVTy8PCelaPTvStlbd5a7X32FdKqkKHsZwHdwBnBA5TI7SHvajUwtpXejP+bC0AAOvq2EAYPMcsnn0M3TX0LycxV2t1bDZcE1aEAbbkIf2cmTH6GdA3aJxpHBqpSphs7ld7Mm790MXOPHmfpOPucV2MqKENbsu5GbLYYgHPl4jGesHuvLk9ACd21c4z8yTMeTmnMQ0aNvE1/crI/zMOX0E7H8O9d+YGp0lmNrpnA9xwVb+n1nnO6dH2A1WziNQ8LVsqPzG4fdBObjeUhmLqaWrssqf16rHrb/ADIxU/pKszoO3+l7riV/gLe7vX/Wg3H+YNOdzIqcbQYWBpIPKd0bfI6iwKFkfvILvjF4dAwJNkrZ5QXkDZKUhhczyJaVbo26WpHhbmODKwZMQwMJRRRQFgWIjJhItkboSKWlTQkpK2SLSsBmlbQhklbJACkyMtKSJSNDICOJLbG2ygFmb/YfTd7xLSIRkLYbT5IrOPuomAFnafhbRniDP/h6a1vIlkX9CZUrygwH/EbU7+IOueVSInkTlj/5CctNrtGll/EtStaPZY9zIqIpZm2gLyA8po6fstXQos4leKfEaWgq+ob4M3NU+/yg5bbwMOYrRmYIqlmY4VVBZmPsAHMz1PsOn/5uksbV1mh77twD4DmpUXbuHUcy/I4PWcy3amvTKa+HadNMpGDaRvvcfxO2T98TC1vGNXezNbqbGVgV7pCEqCkYIKDkx+J5xypl63rEbnCu2Gqa6ws1e21i4ZwAzKowAuMcyPbBNRqdXr9RZR3dliXFcsFUqigYC7nICjmehB6EZ6HGazIwyVvywGetGdfiGxmafZMH83Um+xUfeCqWWIrYRmAIU8xkDlNFzS3nkWGdxTSHT2HTHm1AFbNnO49eXwAIUfBRAszoO2le3X3/AMQqb60p/XMwCs5r/cyiM0OA3bNXpn92+r6FwD9jAMS2g7XRvFXRh5hgYLwww7f8V6ManTWe/QyfyOT/AO84TM9J/FZQyaNwQSpuQ/DIQ/0nnW2VyL8mMqMiTLGWVsJCQsIloxeJhK2lqQJF5HdIxSsGSDSamVCXIINATQS1VjIsvRJDEQxFCO7ikgH9zF3M0/y/wj/l5zdxYZLUytqZsHTyDaeCseGM1ErNM2m00rbTSlYYYxokTRNg6aROmlKx4Y/cxu6mudLIHTSlYYZRqnW/h3xCnS6i59Q4RW07KHYhVBDBiCT06TFOnjNpvAj6y55Mej6m3xDtTWGtHDkStLXdrNQoY23MTkncwzjmenKc1aXclnJZj1LEkmFDT/CTFEdc2/0NSAiqSFUPWiSFMydj6md3c1OzKY1unP8A1CPqjD+sgaYXwTbXqqHY7VWxck9AOmfvCb/JCck+3lX/ABpPvU0n7Ef0mHouGXahtlNb2Eddo9Ff8zHkvzM7vtXZoRqRY5bUWd2qLp1ZUX0STufnuI5/Aec57W8avsXu020VDpVQAigfKb3ibdPP9ElvoZOztFPPWapVP+DpcWP5FzyB8gYRXx3SaUE6TQhnGAllrK1hPvFnzt8PVEw+7ycnnnxPjJrVM/nmf2r/AKPqx+I8Qs1RV7BtIydiuzoGJ5kEgH2e3p1gfdQ8Ux+6kPl16w6mY1cpeuajUypqYKxdTKdJWyTSamUvVNJsMM8pFshjVyPdzVUh9QdUl6JJpXL0rk1QsI1pCkSOlcKRJjVhhTsjwru4pPcRvd3H7uWAyQnP0ZWFPdRdzCQJILFjH1AjRIHTzR2RikPJXUzTp5E6eaRSRKQ1h0Mw6eVtp5qtXIMkFTGoMtqJHuJpNXKykfc0UAPcRxRDNkfZJfIV0BBTF3UL2RFZm+QfUCNUrauGMsrYQ+QOhnLo0UsyqqsTlmA5k+0mT7uFMsgRG+Rv2P4ygVya1y0CSAi7j+MrFcXdy6KHcXxg7Vyl64YRK2WUrJfGAPVKmqmgySpkms2L4zPaqQ7qHlJHu5ouQXQDFcuRJcK5NEiqwcDIkIRIyrLVEyqzOoG2x5OKR2I6miLJarzOWyXI89N8Q0aCPLlaAo8IRplUFIIEliVqZYJi4LQxEiRLMSJEnqMrIlbCXESthF1GippU0saUOZFI0QiY26QLSG6YMeouLRi0pLxi8hh2RJmlbGMzStmggVCYyOZFjGJlI0lk8xbpDMbdHhqki3dFulW6LdDAxFhaMTK90W6MlpEyZAxsxZlInqiJEjiTJkZWh1Q22SAjR8w0TkmJNTKgZMNJZlUlmYpXujxYZdSSNL0MUU99nOgqswlDHimFloISXARRTJloliMViiktDIsspdY8UzoAZxBrI8Uwoeg7GQJiimFCbZAtG3RRSCdYxaQJiigUmxjGiilI2hjGMYopRsmNGzFFGh6NFFFGA8UUUAGjGKKADExZiilCYg0mGiiiIofMUUUDM//Z"
                  ></img>
                </div>
              </InfoWindow>
            )} */}
          </Marker>
        )}

        {dire != null && (
          <DirectionsRenderer directions={dire}></DirectionsRenderer>
        )}
      </GoogleMap>
    </div>
  );
};

export default TrackOrder;
