import { isEditable, setSelectionRange } from '@testing-library/user-event/dist/utils';
import React, { useEffect, useState, useRef, useReducer } from 'react';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import { data } from './data';
import { dataForUseReducer } from './dataForUseReducer';

import Modal from './Modal';


const App = () => {
    // [1]
    // the useState function returns an array [default value, handler], that' why we destructure it.
    const [text, setText] = useState('default text value');

    // let's play with the text state handler
    const clickHandler1 = () => {
        // if i wanted to get the value we use the first element in our state array
        // if we wanted to change it's value (state), use the handler(callback), 2nd element
        // that's it.
        if( text === 'default text value' ) {
            return setText('text changed....');
        } else {
            return setText('default text value');
        }
    };

    // [ 2 ]
    // let's use useSate with an array of objects
    // the intial value is the imported data
    const [people, setPeople] = useState(data);
    const removeItemHandler = id => {
        const newPeople = people.filter(person => person.id !== id);
        // now, let's use the state to update the value on both places(here, ui)
        return setPeople(newPeople);
    }
    const returnPeopleHandler = () => {
        return setPeople(data);
    };

    // [ 3 ]
    // let's use useStae with an object
    const [person, setPerson] = useState({
        name: 'ahmed',
        age: 23,
        message: "I'm sad, what about you?"
    });
    // when dealing with some properties of this object and want to change on them, we wipe all the object value and reassining it a new value
    // setPerson({message: 'message changed...'})
    // now, we converted te person from a compelx object into just a string (onely message)
    // so, we need to do it this way to avoid what happened above. Solution?
    // use spread operator to copy all the values and then override whter we want.
    // setPerson({ ...Person, message: 'changed message' });
    const changeUsermessageHandler = () => {
        return setPerson({
            ...person,
            message: "I'm happy now, thank you:)"
        })
    };

    // [4]
    // Until now, we were passing som new values to the setState and update values. we also can pass a function, let's see!
    const [counterValue, setCounterValue] = useState(0);
    // last senarios, we passed a new value and updated the old one with it (default) and that was okay for us, but in some senarios we need to get the versions of our sate not only the default and the newest one, if we completed on the previous senarios, we increment the counter value only once at a time (no matter how many you clicked the button), but we want to make the counter increase as much as we click on the button
    // we can use this approach with any time of data not just numbers may be with strings by showing user some notification on some events and so on.
    const increaseCounterCrazyHandler = () => {
        // let's use setTimeOut() for making it just be lazy a little bit
        return setTimeout(() => {
            // now, let's pass a function
            setCounterValue(prevCounterSate => {
                // let's add 1 to the last state of our counter value
                return prevCounterSate + 1
            });
        }, 1000);
    }

    // [5]
    // let's use useEffect react hook
    // it takes an arrow function (callback)
    const [counter2Value, setCounter2Value] = useState(0);
    useEffect(() => {
        // remeber: runs on every render. So, let's updated the documetn title on chaging the counter state value
        if(counter2Value > 0) {
            return document.title = `You clicked ${counter2Value} times`; 
        }
    });

    // [6] useEffect dependency list (second parameter)
    // useEffect(function that we want to run on every render, array of dependcy)
    // note: we pas an empty array if you want to run the function in useEffect on intial render only and no on every rerender
    // useEffect(function, []);
    // so what if i wanted to run useEffect() on everyrender (on chaning state of some values)? we pass those values in the array. So the better form of the las function is:
    useEffect(() => {
        // remeber: runs on every render. So, let's updated the documetn title on chaging the counter state value
        if(counter2Value > 0) {
            return document.title = `You clicked ${counter2Value} times`; 
        }
        // think of it as connecting useEffect with useState
    }, [counter2Value]);// we can pass many values
    // note: we can use useEffec() as many times as we want every one of them has it's separate block, so act different upon your rules.

    // [7] Clean up function:
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        // let's add event listener on resizing the window
        window.addEventListener('resize', () => {
            return setWindowWidth(window.innerWidth);
        });
        // Now, there is a problem, once the user resize the window, he triggers our event.
        // go to developer tool, check elements=>eventlisterns, you will find many processes there, and by time, this will make the app with the user crash (consuming memore), so we need to exist the. So, what the solution?
        // In this senario, we could  use empty array as second parameter. So, the useEffect only runs on the intial render (one event is triggered). But this solution is not handy, why?
        // in the future, we will use useEffect on appearing and hiding our components, so we well use more event lisenter. So, once our application gets bigger and we got more componenetns, we would have the same problem, so wha is the better solution?
        // Use a clean up function :)
        return () => {
            window.removeEventListener('resize', () => {
                // remeber: we can refacotro our code. as this callback is used many times;)
                return setWindowWidth(window.innerWidth);
            })
        };
    });

    // [7] UseEffecty and fetching data:
    const [users, setUsers] = useState([]);
    // Note: we can't use async await for the pass callback function in useEffect()
    // let's fetch users from github (by fetch or any external libray as axios)
    const getUsers = async () => {
        const response = await fetch('https://api.github.com/users');
        const users = await response.json();
        // don't setUsers(users) until you put an empty array in your useEffect, to prevent the user browser form crashing (infinte loooooooooooooop)
        return setUsers(users);
        // now the fetch request only send once on the intial render
    };
    useEffect(() => {
        getUsers();
    }, [])

    // [8] Conditional rendering
    // we can use conditions in our components, if true return that part, if false return that
    // or even i can return undefined (nothing).
    // const [isLoading, setIsLoading] = useState(true);
    // And use it like this:
    // if(isLoading) { // it's just an example, you can go crazy as much as you can
    //     return (
    //         <h2>loading....</h2>
    //     )
    // } else {
    //     return (
    //         <ul>
    //             <li>loaded content 1</li>
    //             <li>loaded content 2</li>
    //             <li>loaded content 3</li>
    //         </ul>
    //     )
    // }
    // we also can use it when the user is signed in, render him a giant component(with many small components), if not just render him a sign up component or something like that.

    // Let's see a live example:
    // let's fetch data, so we have a loading state, error state, final state(every thing went okay)
    // const [isError, setIsError] = useState(false);
    // const [user, setUser] = useState('default user');


    // Let's control our displayed component by useEffect()
    // useEffect(() => {
    //     fetch('https://api.github.com/users/QuincyLarsons')
    //         .then(response => {
                // we have to define this condtion as fetch doen't return error if the user
                // is not found for example, unlike other external libraries as axios
    //             if(response.status >= 200 && response.status <= 299){
    //                 return response.json();
    //             } else {
    //                 setIsLoading(false);
    //                 setIsError(true);
    //                 throw new Error(response.statusText);
    //             }
    //         })
    //         // let's create more then blocks, to change our states
    //         .then(user => {
    //             const { login } = user;
    //             setUser(login);
    //             setIsLoading(false);
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         })
    // }, []);

    // if(isLoading) {
    //     return (
    //         <div>
    //             <h2>
    //                 Loading....
    //             </h2>
    //         </div>
    //     )
    // }else if(isError){
    //     return (
    //         <div>
    //             <h2>
    //                 Error....
    //             </h2>
    //         </div>
    //     )
    // }else{
    //     return (
    //         <div>
    //             <h2>
    //                 { user }
    //             </h2>
    //         </div>
    //     )
    // }
    // [9] More on conditional rendering (short-circut evaluation)
    // we said, we can't write if statments in the return block, but what if we want to do
    // some condions withing the giant component?, solution? is to use short-circut evaluation (||, &&) in the return block, second solution is to use ternary operator;
    // note: empty string is a falsy value
    const [conditionalText, setconditionalText] = useState('');// it's a falsy value
    const [conditionalError, setConditionalError] = useState(false);
    const firstValue = conditionalText || 'hello, world',// here hello message is the value
        secondeValue = conditionalText && 'hello, world'; // here, if the value is truthy, it returns
        // the second value (hello world), if the value is falsy, it returns it and doens't 
        // go furher to hte next values and we use this for showing and hiding inner components or simply elements.

    // let's do another example on conditions, but this time not on element, on components
    const [show, setShow] = useState(false);


    // [10] Form basics:
    // Let's create state values and connect them to the input values
    // const [firstName, setFirstName] = useState('');
    // const [email, setEmail] = useState('');
    const [inputPerson, setInputPerson] = useState({
        firstName: '',
        lastName: '',
        age: 0,
        email: ''
    });// we used this syntax instead of using multiple states (Refactoring).
    const [inputPeople, setInputPeople] = useState([]);

    // Imagine we have multiple inputs (20 inputs for example), then we have more repeated code
    // Solution? give all the input the same handler on change event.
    const inputHandler = event => {
        // we can access the value and the attributes from the event object.
        const name = event.target.name,
            value = event.target.value;
        setInputPerson({
            ...inputPerson,//spread operator
            [name]: value
        });
    };

    const submitHandler = event => {
        // to prevent browser from self-refreshing on loading, just as vanilla js.
        event.preventDefault();
        // now i can send the state values to our backend server and that's it!
        // let's show user all created users, just as an example
        if(
            inputPerson.firstName &&
            inputPerson.lastName && 
            inputPerson.age && 
            inputPerson.email

            ) {// if both have values
            // let's create a new object
            const newPerson = {
                // give him unique id
                id: new Date().getTime().toString(),
                ...inputPerson
            };
            setInputPeople(( people => {//people her refers to the input people state value
                return [...people, newPerson];
            }));
            // now set back the state values to empty values to make the input look good 
            // and be ready for the user next adding
            setInputPerson({
                firstName: '',
                lastName: '',
                age: 0,
                email: ''
            });
        }
    };

    // [11] UseRef() hook
    const refContainer = useRef(null);// just refer to this value in the input

    const submitForUseRefHandler = event => {
        event.preventDefault();
        // now we have access on this element (input), so instead of useing event.target.value and so on
        // console.log(refContainer.current.value)
    };
    // Benfits: 
    // - We didn't use state to preserve values.
    // - no rerendering happen on updating.
    // - We can get whatever element we want.

    // Tip: if you want to focus on input field on the first load. use it with useEffect()
    // we don't have to worry about the dependencies as we said it doesn't trigger the rerender.
    useEffect(() => {
        // we just call the focus method on the desired input element.
        // console.log(refContainer.current); returns the input element.
        // refContainer.current.focus();
    });

    // [12] useReducer() hook => Role: structure our app status. 
    // const [useReducerPeople, setUseReducerPeople] = useState(dataForUseReducer);
    // const [showModal, setShowModal] = useState(false);// toggle functionality.
    const [useReducerName, setUseReducerName] = useState('');
    const [state, dispatch] = useReducer(reducer, defaultState);// now this returns the  state value and a dispatch function and we just pass a reducer function and a default state object.
    // the reducer function runs once, we call the dispatch function


    // this approach is good, but when our app gets bigger, it will ge more complecated. So, we need to use useReducer() to act better. (remove showModal and people states)

    const useReducerSubmitHandler = e => {
        console.log('submit')
        e.preventDefault();
        // let's add the input value to our data
        if(!useReducerName) { // If is empty => show modal (inform him):red
        }
        // show model (inform him also): green.
    };
















    return (
        // the container class if just for styling purposes
        <div className="container" style={{ marginBottom: '100px'}}>
            <h1>Advanced React topics</h1>
            <h2>
                useState hook basics
            </h2>
            <p>
                { text }
            </p>
            <button
                style={{ marginBottom: '20px'}}
                className='btn'
                type="button" 
                onClick={ clickHandler1 }
                >
                click to change text above
            </button>


            <h2>
                Hooks with array of objects
            </h2>
            <button
            // Let' make the function inline this time, buy changing the value of people to
            // an empty array. and make it arrow function to prevent it to be invoked on first render. 
                className='btn'
                type='button'
                onClick={ () => setPeople([]) } 
                >
                clear all items bellow
            </button>
            <button
                className='btn'
                type='button'
                onClick={ returnPeopleHandler }
                >
                Return back all item
            </button>
            {
                people.map(({ id, name }) => {
                    return (
                        <div className="item" key={ id }>
                            <h4>
                                { name }
                            </h4>
                            <button
                                type='button'
                                onClick={ () => removeItemHandler(id) }
                                >
                                remove item
                            </button>
                        </div>
                    )
                })
            }


            <h2>
                Hooks with objects
            </h2>
            <button
                style={{ marginBottom: '20px'}}
                className='btn'
                type='button'
                onClick={ changeUsermessageHandler }
                >
                click to make me happy
            </button>
            <h4>
                { person.message }
            </h4>


            <h2>
                Example on passing function to the state
            </h2>
            <h3 
                style={{ marginBottom: '20px'}}>
                Regular Counter example
            </h3>
            <h4>
                { counterValue }
            </h4>
            <button
                className='btn'
                type='button'
                onClick={ () => setCounterValue(counterValue - 1) }
            >
                Decrease
            </button>
            <button
                className='btn'
                type='button'
                onClick={ () => setCounterValue(0) }
            >
                Reset   
            </button>
            <button
                className='btn'
                type='button'
                onClick={ () => setCounterValue(counterValue + 1) }
            >
                Increase
            </button>
            {/* Now, let pass a function */}
            <br />
            <button
                style={{ marginBottom: '20px' }}
                className='btn'
                type='button'
                onClick={ increaseCounterCrazyHandler }
                >
                Increase as much as you click
            </button>

            {/* ============================================= */}
            <h2>
                UseEffect hook basics
            </h2>
            <h4>
                { counter2Value }
            </h4>
            <button
                style={{ marginBottom: '20px'}}
                className='btn'
                type='button'
                onClick={ () => setCounter2Value(counter2Value + 1) }
                >
                click to increase by 1 and see the change in the document title
            </button>

            <h2>
                useEffect clean up function
            </h2>
            <h4>
                show window width
            </h4>
            <p>Width: { windowWidth }</p>

            <h2>
                Fetch github users by using useEffect and useState
            </h2>
            <ul className="users">
                {users.map(({id, login, avatar_url, html_url}) => {
                    return (
                        <li key={ id }>
                            <img src={avatar_url} alt={login} />
                            <div>
                                <h4>{login}</h4>
                                <a href={html_url}>profile</a>
                            </div>
                        </li>
                    )
                })}
            </ul>

            <h2>Conditional rendering (short-circut evaluation)</h2>
            {/* 
                here the first variable value is falsy, so it goes for the second and so on
                and if all the values are falsy, won't display anything.
            */}
            <h4>Text: {conditionalText || firstValue}</h4>
            {/* 
                if the first value is truthy, then go for the next one if it's truthy go for the next and so on, so ,we use it to return elements and component in JSX
            */}
            {/* 
                { true && <p>the first value was true</p> }
                { !true && <p>the first value was true</p> }
                Let's use a toggle button to show more, instead of hard coding
            */}

            {conditionalError && <h4>Sorry, but error....</h4>}
            {/* 
                Note: this approach gives you only one choice, if you want to have two choices (truthy and falsy choice) use ternary operator
                condition ? true : false;
            */}

            <h2>
                Ternary operator
            </h2>
            {conditionalError ? <h4>There is an error</h4> :
            <h4>
                There isn't any error    
            </h4>}

            <button 
                style={{marginBottom: '20px'}}
                type='button'
                className='btn'
                onClick={() => {
                    setConditionalError(!conditionalError);
                }}
                >
                    Toggle error state value
            </button>
            

            <h2>
                Show/Hide
            </h2>
            {/* 
                we use short-circut evalution as we don't need to have 2 choices
                this senario is just render if it's true, that's it.
            */}
            { show && <Item/> }
            <button 
                style={{marginBottom: '20px'}}
                type='button'
                className='btn'
                onClick={() => {
                    setShow(!show);
                }}
                >
                    Show/Hide
            </button>
            
            {/* //===================================== */}

            <h2>Form bascis</h2>
            <form className="form" onSubmit={ submitHandler }>
                <div className="form-control">
                    <label htmlFor="firtName">First Name: </label>
                    <input 
                    type="text" 
                    id='firstName'
                    name='firstName'
                    placeholder='Ahmed Elgaidi'
                    value={inputPerson.firstName}
                    // As we were using the event object in the submit event
                    // we can use the event also to access the event objedct from our 
                    // handler
                    onChange={ inputHandler }
                    required
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="lastName">Last Name: </label>
                    <input 
                    type="text" 
                    id='lastName'
                    name='lastName'
                    placeholder='Elgaidi'
                    value={ inputPerson.lastName}
                    // As we were using the event object in the submit event
                    // we can use the event also to access the event objedct from our 
                    // handler
                    onChange={ inputHandler }
                    required
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="age">Age: </label>
                    <input 
                    type="number" 
                    id='age'
                    name='age'
                    placeholder='18'
                    value={ inputPerson.age }
                    // As we were using the event object in the submit event
                    // we can use the event also to access the event objedct from our 
                    // handler
                    onChange={ inputHandler }
                    required
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="email">Email: </label>
                    <input 
                    type="email" 
                    id='email' 
                    name='email'
                    placeholder='ahmed@gmail.com'
                    value={ inputPerson.email }
                    onChange={ inputHandler }
                    required
                    />
                </div>
                <button 
                    type='submit'
                    className='button'>
                    Add person
                </button>
                {/* 
                    To submit this form, we have two options, submit event on the form or
                    click event on form button.
                */}
            </form>
            <h3>People saved from above form:</h3>
                {inputPeople.map(({ id, firstName, lastName, age, email }) => {
                    return (
                        <div className="item" key={ id }>
                            <h4>{ firstName }</h4>
                            <p>{ lastName }</p>
                            <p>{ age }</p>
                            <p>{ email }</p>
                        </div>
                    );
                })}
            
            <h2>UseRef()</h2>
            <form action="" className="form" onSubmit={ submitForUseRefHandler }>
                <div className="">
                    <input type="text" ref={ refContainer } />
                    <button type='submit'>submit</button>
                </div>
            </form>
            


            <hr />
            <div className="container">
                <h2>UseReducer: structure our states</h2>
                {/* {state.isModalOpen && <Modal/ modalContent={  }>} */}
                <form className="form" onSubmit={ useReducerSubmitHandler }>
                    <input 
                        type="text" 
                        value={ useReducerName }
                        onChange={ e => setUseReducerName(e.target.value) }
                    />
                    <button style={{marginBottom: '20px'}} type='submit'>Add</button>
                    {state.people.map(({ id, name }) => {
                        return <div className="" key={ id }>
                            <p>{ name }</p>
                        </div>
                    })}
                </form>
            </div>
        </div>
    );
}

// let's create a component for testign on conditional redering with components not elements
const Item = () => {
    // let's make it more complex component by adding some eventlisitener
    // side effect happens, then the role of useEffect arise
    const [size, setSize] = useState(window.innerWidth)
    const checkSize = () => {
        setSize(window.innerWidth);
    };
    useEffect(() => {
        window.addEventListener('resize', checkSize);
        // clean up function
        return () => {
            window.removeEventListener('resize', checkSize);
        }
    }, []);

    return (
        <div>
            <h3>This component is for testing...</h3>
            <h4>Window size: {size} px</h4>
        </div>
    )
};

// reducer function
const reducer = (state, action) => {
    // the action is the action that we want to do on our state
};
// default state for reducer function
const defaultState = {
    people: [], // empty array
    isModalOpen: false,//intial value is false
    modalContent: ''// intial value is empty string content
}

export default App;